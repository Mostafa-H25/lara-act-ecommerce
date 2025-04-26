import ProductItem from '@/Components/App/ProductItem';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, PaginatedData, Product } from '@/types';
import { Head } from '@inertiajs/react';

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
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </AuthenticatedLayout>
  );
}
