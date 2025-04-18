import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData, Product } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Home({
  products,
}: PageProps<{
  products: PaginatedData<Product>;
}>) {
  return (
    <AuthenticatedLayout>
      <Head title="Welcome" />
      <div className="hero h-[300px] bg-gray-800">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-2 lg:grid-cols-3">
        {products.data.map((product: Product) => (
          <div key={product.id} className="card bg-base-100 shadow-xl">
            <Link href={route('product.show', product.slug)}>
              <figure>
                <img
                  src={product.image}
                  alt={product.title}
                  className="aspect-square object-cover"
                />
              </figure>
            </Link>
            <div className="card-body">
              <h2 className="card-title">{product.title}</h2>
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
                <button className="btn btn-primary">Add to Cart</button>
                <span className="text-2xl">{product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AuthenticatedLayout>
  );
}
