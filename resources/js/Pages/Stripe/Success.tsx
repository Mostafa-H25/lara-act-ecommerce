import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Order, PageProps } from '@/types';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';

const Success = ({ orders }: PageProps<{ orders: Order[] }>) => {
  return (
    <AuthenticatedLayout>
      <div className="mx-auto w-[480px] px-4 py-8">
        <div className="flex flex-col items-center gap-2">
          <CheckCircleIcon className="size-24" />
        </div>
        <div className="text-3xl">Payment was Completed</div>
      </div>
      <div className="my-6 text-lg">
        Thanks for your purchase. Your payment was completed successfully.
      </div>
      {orders.map((order: Order) => (
        <div
          key={order.id}
          className="mb-4 rounded-lg bg-white p-6 dark:bg-gray-800"
        >
          <h3 className="mb-4 text-3xl">Order Summary</h3>
          <div className="mb-2 flex justify-between font-bold">
            <div className="text-gray-400">Seller</div>
            <div>
              <Link href="#" className="hover:underline">
                {order.vendorUser.store_name}
              </Link>
            </div>
          </div>
          <div className="mb-2 flex justify-between">
            <div className="text-gray-400">Order Number</div>
            <div>
              <Link href="#" className="hover:underline">
                #{order.id}
              </Link>
            </div>
          </div>
          <div className="mb-2 flex justify-between">
            <div className="text-gray-400">Order Items</div>
            <div>{order.orderItems.length}</div>
          </div>
          <div className="mb-2 flex justify-between">
            <div className="text-gray-400">Total</div>
            <div>${order.total_price}</div>
          </div>
          <div className="mb-4 flex justify-between">
            <Link href="#" className="btn btn-primary">
              View Order Details
            </Link>
            <Link href={route('dashboard')} className="btn">
              Back to Home
            </Link>
          </div>
        </div>
      ))}
    </AuthenticatedLayout>
  );
};

export default Success;
