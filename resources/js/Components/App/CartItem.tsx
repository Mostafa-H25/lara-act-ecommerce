import { productRoute } from '@/helpers/productRoute';
import { CartItem as CartItemType } from '@/types';
import { Link, router, useForm } from '@inertiajs/react';
import { ChangeEvent, useState } from 'react';
import TextInput from '../Core/TextInput';

type Props = { item: CartItemType };

const CartItem = ({ item }: Props) => {
  console.log(item);
  const deleteForm = useForm({ option_ids: item.option_ids });

  const [error, setError] = useState('');

  const onDeleteClick = () => {
    deleteForm.delete(route('cart.destroy', item.product_id), {
      preserveScroll: true,
    });
  };

  const handleQuantityChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setError('');
    router.put(
      route('cart.update', item.product_id),
      {
        quantity: ev.target.value,
        option_ids: item.option_ids,
      },
      {
        preserveScroll: true,
        onError: (errors) => {
          setError(Object.values(errors)[0]);
        },
      },
    );
  };

  return (
    <>
      <div key={item.id} className="flex gap-6 p-3">
        <Link
          href={productRoute(item)}
          className="flex size-32 justify-center self-start"
        >
          <img
            src={item.image}
            alt={item.name}
            className="aspect-auto w-full"
          />
        </Link>
        <div className="flex flex-1 flex-col">
          <div className="flex-1">
            <h3 className="mb-3 text-sm font-semibold">
              <Link href={productRoute(item)}>{item.name}</Link>
            </h3>
            <div className="text-xs">
              {item.options.map((option) => (
                <div key={option.id}>
                  <strong className="text-bold">
                    {option.type.name}&nbsp;
                  </strong>
                  {option.name}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              Quantity:&nbsp;
              <div
                className={error ? 'tooltip tooltip-open tooltip-error' : ''}
                data-tip={error}
              >
                <TextInput
                  type="number"
                  defaultValue={item.quantity}
                  onBlur={handleQuantityChange}
                  className="input-sm w-16"
                />
              </div>
              <div className="text-lg font-bold">
                ${item.price * item.quantity}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => onDeleteClick()}
                className="btn btn-error btn-sm"
              >
                Delete
              </button>
              <button
                // onClick={() => onSaveClick()}
                className="btn btn-accent btn-sm"
              >
                Save For Later
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="divider"></div>
    </>
  );
};

export default CartItem;
