<?php

namespace App\Http\Controllers;

use App\Enum\OrderStatusEnum;
use App\Http\Resources\OrderViewResource;
use App\Mail\CheckoutComplete;
use App\Mail\NewOrderMail;
use App\Models\CartItem;
use App\Models\Order;
use Doctrine\DBAL\Driver\PgSQL\Exception\UnexpectedValue;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Stripe\Exception\SignatureVerificationException;
use Stripe\StripeClient;
use Stripe\Webhook;

class StripeController extends Controller
{
    public function success(Request $request)
    {
        $user = auth()->user();
        $session_id = $request->get('session_id');
        $orders = Order::where('stripe_session_id', $session_id)->get();
        if($orders->count() === 0) {
            abort(404);
        }

        foreach($orders as $order) {
            if($order->user_id !== $user->id) {
                abort(403);
            }
        }
        return Inertia::render('Stripe/Success', ["orders" => OrderViewResource::collection($orders)->collection->toArray()]);
    }

    public function failure()
    {

    }
    public function webhook(Request $request)
    {
        $stripe = new StripeClient(config('app.stripe_secret_key'));
        $endpoint_secret = ('app.stripe_webhook_secret_key');

        $payload = $request->getContent();
        $sig_header = $request()->header('Stripe-Signature');

        $event = null;

        try {
            $event = Webhook::constructEvent(
                $payload, $sig_header, $endpoint_secret
            );
        } catch (UnexpectedValue $e) {
            Log::error($e);
            return response('Invalid Payload', 400);
        }catch(SignatureVerificationException $e){
            Log::error($e);
            return response('Invalid Payload', 400);
        }

        Log::info('=========================================');
        Log::info('=========================================');
        Log::info($event->type);
        Log::info($event);

        switch ($event->type) {
            case 'charge.updated':
                $charge = $event->data->object;
                $transactionId = $charge['balance_transaction'];
                $paymentIntent = $charge['payment_intent'];
                $balanceTransaction = $stripe->balanceTransaction->retrueve($transactionId);

                $orders = Order::where('payment_intent', $paymentIntent)->get();
                $totalAmount = $balanceTransaction['amount'];
                $stripeFee = 0;

                foreach($balanceTransaction['fee_details'] as $fee_detail) {
                    if($fee_detail['type'] === 'stripe.fee'){
                        $stripeFee = $fee_detail['amount'];
                    }
                }

                $platformFeePercent = config('app.platform_fee.pct');

                foreach($orders as $order) {
                    $vendorShare = $order->total_price/$totalAmount;

                    $order->online_payment_commission = $vendorShare * $stripeFee;
                    $order->website_commission = ($order->total_price - $order->online_payment_commission) / 100 * $platformFeePercent; 
                    $order->vendor_subTotal = $order->total_price - $order->online_payment_commission - $order->website_commission;

                    $order->save();

                    Mail::to($order->vendorUser)->send(new NewOrderMail($order));
                }

                Mail::to($order[0]->user)->send(new CheckoutComplete($orders));


                break;
            case 'checkout.session.completed':
                $session = $event->data->object;
                $pi = $session['payment_intent'];
                $orders = Order::query()->with(['orderItems'])->where(['stripe_session_id' => $session['id']])->get();
                $productsToBeDeletedFromCart = [];

                foreach ($orders as $order) {
                    $order->payment_intent = $pi;
                    $order->status = OrderStatusEnum::Paid;
                    $order->save();

                    $productsToBeDeletedFromCart = [
                        ...$productsToBeDeletedFromCart,
                        ...$order->orderItems->map(fn($item) => $item->product_id)->toArray()
                    ];

                    foreach($order->orderItems as $orderItem) {
                        $options = $orderItem->variation_type_option_ids;
                        $product = $orderItem->product;
                        if($options) {
                            sort($Options);
                            $variation = $product->variations()->where("variation_type_option_ids", $options)->first();
                            if($variation && $variation->quantity != null){
                                $variation->quantity -= $orderItem->quantity;
                                $variation->save();
                            }
                        }else if($product->quantity != null){
                            $product->quantity -= $orderItem->quantity;
                            $product->save();
                        }
                    }

                }
                CartItem::query()->where("user_id", $order->user_id)->whereIn('product_id', $productsToBeDeletedFromCart)->where('saved_for_later', false)->delete();
                break;
            default:
                    echo 'Received unknown event type '. $event->type;
                break;
        }

        return response('', 200);
    }

    public function connect()
    {
        if(!AUTH()->user()->getStripAccountId()){
            auth()->user()->createStripeAccount(['type' => 'express']);
        }

        if(!auth()->user()->isStripeAccountActive()){
            return redirect(auth()->user()->getStripeAccountLink());
        }

        return back()->with('success', 'Your account is already connected.');
    }

}
