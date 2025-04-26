import { productRoute } from '@/helpers/productRoute';
import { Link, usePage } from '@inertiajs/react';

const MiniCartDropdown = () => {
  const { miniCartItems, totalPrice, totalQuantity } = usePage().props;
  return (
    <div
      tabIndex={0}
      className="card-compact z-1 card dropdown-content mt-3 w-96 bg-base-100 shadow"
    >
      <div className="card-body">
        <span className="text-lg font-bold">{totalQuantity} Items</span>
        <div className="my-4 max-h-[300px] overflow-auto">
          {miniCartItems.length === 0 ? (
            <div className="py-2 text-center text-gray-500">
              You don't have any items yet
            </div>
          ) : (
            miniCartItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-3">
                <Link href={productRoute(item)}>
                  <img src={item.image} alt={item.name} className="size-20" />
                </Link>
                <div className="flex-1">
                  <h3 className="mb-3 font-semibold">
                    <Link href={productRoute(item)}>{item.name}</Link>
                  </h3>
                  <div className="flex justify-between text-sm">
                    <div>Quantity: {item.quantity}</div>
                    <div className="font-bold">
                      ${item.quantity * item.price}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <span className="text-lg font-bold text-info">
          Subtotal: ${totalPrice}
        </span>
        <div className="card-actions">
          <Link
            href={route('cart.index')}
            className="btn btn-primary btn-block"
          >
            View cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MiniCartDropdown;
