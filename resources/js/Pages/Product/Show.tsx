import Carousel from '@/Components/Core/Carousel';
import { arraysAreEqual } from '@/helpers/arraysAreEqual';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Product, VariationTypeOption } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

const Show = ({
  product,
  variationOptions,
}: {
  product: Product;
  variationOptions: number[];
}) => {
  const form = useForm<{
    option_ids: Record<string, number>;
    quantity: number;
    price: number | null;
  }>({
    option_ids: {},
    quantity: 1,
    price: null,
  });

  const { url } = usePage();

  const [selectedOptions, setSelectedOptions] = useState<
    Record<number, VariationTypeOption>
  >([]);

  const images = useMemo(() => {
    for (const typeId in selectedOptions) {
      const option = selectedOptions[typeId];

      if (option.images?.length > 0) return option.images;
      return product.images;
    }
  }, [product, selectedOptions]);

  const computedProduct = useMemo(() => {
    const selectedOptionIds = Object.values(selectedOptions)
      .map((op) => op.id)
      .sort();
    for (const variation of product.variations) {
      const optionIds = variation.variation_type_option_ids.sort();

      if (arraysAreEqual(selectedOptionIds, optionIds)) {
        return {
          price: variation.price,
          quantity:
            variation.quantity === null ? Number.MAX_VALUE : variation.quantity,
        };
      }
    }
    return {
      price: product.price,
      quantity: product.quantity,
    };
  }, [product, selectedOptions]);

  useEffect(() => {
    for (const type of product.variationTypes) {
      const selectedOptionId: number = variationOptions[type.id];
      chooseOption(
        type.id,
        type.options.find((op) => op.id == selectedOptionId) || type.options[0],
        false,
      );
    }
  }, []);

  const getOptionIdsMap = (newOptions: object) => {
    return Object.fromEntries(
      Object.entries(newOptions).map(([a, b]) => [a, b.id]),
    );
  };

  const chooseOption = (
    typeId: number,
    option: VariationTypeOption,
    updateRouter: boolean = true,
  ) => {
    setSelectedOptions((prev) => {
      const newOptions = {
        ...prev,
        [typeId]: option,
      };

      if (updateRouter) {
        router.get(
          url,
          { options: getOptionIdsMap(newOptions) },
          { preserveScroll: true, preserveState: true },
        );
      }

      return newOptions;
    });
  };

  const onQuantityChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    form.setData('quantity', parseInt(ev.target.value));
  };

  const addToCart = () => {
    form.post(route('cart.store', product.id), {
      preserveScroll: true,
      preserveState: true,
      onError: (error) => console.log(error),
    });
  };

  const renderProductVariationTypes = () => {
    return product.variationTypes.map((type) => (
      <div key={type.id} className="my-4 flex items-center gap-2">
        <b>{type.name}</b>
        <div>
          {type.type === 'image' && (
            <div className="flex gap-2">
              {type.options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => chooseOption(type.id, option)}
                >
                  {option.images && (
                    <img
                      src={option.images[0].thumb}
                      alt=""
                      className={`w-[50px] ${selectedOptions[type.id]?.id === option.id ? 'outline outline-4 outline-primary' : ''}`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
          {type.type === 'radio' && (
            <div className="flex join">
              {type.options.map((option) => (
                <input
                  key={option.id}
                  type="radio"
                  value={option.id}
                  checked={selectedOptions[type.id]?.id === option.id}
                  onChange={() => chooseOption(type.id, option)}
                  className="btn join-item"
                  name={`variation_type_${type.id}`}
                  aria-label={option.name}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    ));
  };

  const renderAddToCartButton = () => {
    return (
      <div className="mb-8 flex gap-4">
        <select
          name=""
          id=""
          value={form.data.quantity}
          onChange={onQuantityChange}
          className="select-bordered select w-full"
        >
          {Array.from({ length: Math.min(10, computedProduct?.quantity) }).map(
            (el, i) => (
              <option key={i + 1} value={i + 1}>
                Quantity: {i + 1}
              </option>
            ),
          )}
        </select>
        <button onClick={addToCart} className="btn btn-primary">
          Add to Cart
        </button>
      </div>
    );
  };

  useEffect(() => {
    const idsMap = Object.fromEntries(
      Object.entries(selectedOptions).map(([typeId, option]) => [
        typeId,
        option.id,
      ]),
    );
    form.setData('option_ids', idsMap);
  }, []);

  console.log(product);
  // console.log(selectedOptions);
  // console.log(variationOptions);
  // console.log(product.variations);
  console.log(computedProduct);
  return (
    <AuthenticatedLayout>
      <Head title={product.name} />

      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="col-span-7">
            <Carousel images={images} />
          </div>
          <div className="col-span-5">
            <h1 className="mb-8 text-2xl">{product.name}</h1>
            <div>
              <div className="font--semibold text-3xl">
                {/* <CurrencyFormatter amount={computedProduct?.price} /> */}
                {computedProduct?.price}
              </div>
            </div>
            {renderProductVariationTypes()}
            {computedProduct?.quantity != undefined &&
              computedProduct?.quantity < 10 && (
                <div className="my-4 text-error">
                  <span>Only {computedProduct.quantity} left</span>
                </div>
              )}
            {renderAddToCartButton()}
            <b className="text-xl">About the Item</b>
            <div
              className="wysiwyg-output"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Show;
