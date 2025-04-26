<x-mail::message>
<h1 style="text-align: center; font-size: 24px">Payment was Completed Successfully</h1>

<x-mail::button :url="$order->id">
  View Order Details
</x-mail::button>

@foreach($orders as $order)
<x-mail::table>
  <table>
    <tbody>
      <tr>
        <td>Seller</td>
        <td><a href="{{ url('/') }}">{{ $order->vendorUser->vendor->store_name }}</a></td>
      </tr>
        <tr>
        <td>Order #</td>
        <td>{{$order->id}}</td>
      </tr>
      <tr>
        <td>Items #<td>
        <td>{{ $order->orderItems->count()}}<td>
      </tr>
      <tr>
        <td>Total<td>
        <td>{{\Illuminate\Support\Number::currency($order->total_price)}}</td>
      </tr>
    </tbody>
  </table>
</x-mail::table>

<hr />

<x-mail::table>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Quantity</th>
        <th>Price</th>
      </tr>
    </thead>
    @foreach($order->orderItems as $orderItem)
    <tbody>
      <tr>
        <td>
          <table>
          <tbody>
            <tr>
              <td style="padding:5px;">
                <img src="{{ $orderItem->product->getImageForOptions($orderItem->variation_type_option_ids) }}" alt="" style="min-width:60px; max-width:60px;">
              </td>
              <td style="font-size:13px; padding: 5px;">{{ $orderItem->product->title }}</td>
            </tr>
          </tbody>
        </table>
      </td>
      <td>{{ $orderItem->quantity }}</td>
      <td>{{ \Illuminate\Support\Number::currency($orderItem->price) }}</td>
      </tr>

    </tbody>
    @endforeach
  </table>
</x-mail::table>
<x-mail::button :url="$order->id">View Order Details</x-mail::button>
@endforeach

<x-mail::subcopy>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa voluptatem culpa quam! Non excepturi exercitationem soluta? Similique quidem sequi fugit architecto molestiae laboriosam, accusantium vitae voluptatibus perferendis perspiciatis delectus illum quasi repellendus, ipsa deleniti sapiente quam recusandae quia nostrum. Sed modi sit quae tempora repudiandae molestiae nam ipsam eius aspernatur.Z</x-mail::subcopy>
  
<x-mail::panel>Thank you for having business with us.</x-mail::panel>
  Thanks,
  <br/>
  {{config('app.name')}}

</x-mail::message>