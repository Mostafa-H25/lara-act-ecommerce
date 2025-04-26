<?php

namespace App\Console\Commands;

use App\Enum\OrderStatusEnum;
use App\Models\Order;
use App\Models\Payout;
use App\Models\Vendor;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PayoutVendors extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:payout:vendors';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Perform vendors payout.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting monthly payout process for vendors...');
        $vendors = Vendor::eligibleForPayout();
        
        foreach ($vendors as $vendor) {
            $this->processPayout($vendor);
        }
        
        $this->info('Monthly payout process for vendors completed.');

        return Command::SUCCESS;

    }

    protected function processPayout(Vendor $vendor) {
        $this->info("Processing payout for vendor [ID={$vendor->user_id}] - {$vendor->store_name}");

        try {
            DB::beginTransaction();
            $startingFrom = Payout::where('vendor_id', $vendor->user_id)
            ->orderBy('until', 'desc')
            ->value('until');

            $startingFrom = $startingFrom?: Carbon::make('1970-01-01');

            $until = Carbon::now()->subMonthNoOverflow()->startOnMonth();

            $vendorSubtotal = Order::query()
            ->where('vendor_user_id', $vendor->user_id)
            ->where('status', OrderStatusEnum::Paid->value)
            ->whereBetween('created_at', [$startingFrom, $until])->sum('vendor_subtotal');

            if($vendorSubtotal){
                $this->info("Payout made with amount {$vendorSubtotal}");
                
                Payout::create([
                    'vendor_id' => $vendor->user_id,
                    'amount' => $vendorSubtotal,
                    'startingFrom' => $startingFrom,
                    'until' => $until,
                ]);

                $vendor->user->transfare((int)($vendorSubtotal*100), config('app.currency'));
            }else{
                $this->info('Nothing to process.');
            }

            
        } catch (\Exception $e) {
            DB::rollBack();
        }

    }
}
