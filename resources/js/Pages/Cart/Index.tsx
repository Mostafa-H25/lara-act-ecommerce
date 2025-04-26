import CartItem from '@/Components/App/CartItem';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { GroupedCartItem, PageProps } from '@/types';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { Head, Link } from '@inertiajs/react';

const Index = ({
  csrf_token,
  cartItems,
  totalPrice,
  totalQuantity,
}: PageProps<{
  cartItems: Record<number, GroupedCartItem>;
  csrf_token: string;
  totalPrice: number;
  totalQuantity: number;
}>) => {
  console.log(cartItems);

  return (
    <AuthenticatedLayout>
      <Head title="Your Cart" />

      <div className="container mx-auto flex flex-col gap-4 p-8 lg:flex-row">
        <div className="card order-2 flex-1 bg-white lg:order-1 dark:bg-gray-800">
          <div className="card-body">
            <h2 className="text-lg font-bold">Shopping Cart</h2>
            <div className="my-4">
              {Object.keys(cartItems).length === 0 ? (
                <div className="py-2 text-center text-gray-500">
                  You don't have any items yet
                </div>
              ) : (
                Object.values(cartItems).map((cartItem) => (
                  <div key={cartItem.user.id}>
                    <div className="mb-4 flex items-center justify-between border-b border-gray-300 pb-4">
                      <Link href="/" className="underline">
                        {cartItem.user.name}
                      </Link>
                      <div>
                        <form action={route('cart.checkout')} method="post">
                          <input
                            type="hidden"
                            name="_token"
                            value={csrf_token}
                          />
                          <input
                            type="hidden"
                            name="vendor_id"
                            value={cartItem.user.id}
                          />
                          <button className="btn btn-ghost btn-sm">
                            <CreditCardIcon className="size-6" />
                            Pay only for this seller
                          </button>
                        </form>
                      </div>
                    </div>
                    {cartItem.items.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="card order-1 bg-white lg:order-2 lg:min-w-[400px] dark:bg-gray-800">
          <div className="card-body">
            Subtotal ({totalQuantity} items): ${totalPrice}
            <form action={route('cart.checkout')} method="post">
              <input type="hidden" name="_token" value={csrf_token} />
              <PrimaryButton className="rounded-full">
                Proceed to Checkout
              </PrimaryButton>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Index;
