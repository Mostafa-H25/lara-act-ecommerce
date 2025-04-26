import { Product } from '@/types';
import { Link, useForm } from '@inertiajs/react';

type Props = { product: Product };

const ProductItem = ({ product }: Props) => {
  const form = useForm({
    quantity: 1,
    option_ids: {},
  });
  const addToCart = () => {
    form.post(route('cart.store', product.id), {
      preserveScroll: true,
      preserveState: true,
      onError: (err) => console.log(err),
    });
  };
  return (
    <div className="card bg-base-100 shadow-xl">
      <Link href={route('product.show', product.slug)}>
        <figure>
          <img
            src={product.image}
            alt={product.name}
            className="aspect-square object-cover"
          />
        </figure>
      </Link>
      <div className="card-body">
        <h2 className="card-title">{product.name}</h2>
        <p>
          by&nbsp;
          <Link href={'/'} className="hover:underline">
            {product.user.name}
          </Link>
          &nbsp;in&nbsp;
          <Link href={'/'} className="hover:underline">
            {product.department.name}
          </Link>
        </p>
        <div className="card-actions mt-3 items-center justify-between">
          <button onClick={addToCart} className="btn btn-primary">
            Add to Cart
          </button>
          <span className="text-2xl">{product.price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
