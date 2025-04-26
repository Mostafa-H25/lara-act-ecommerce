import { CartItem } from '@/types';

export const productRoute = (item: CartItem) => {
  const params = new URLSearchParams();
  Object.entries(item.option_ids).forEach(([typeId, optionId]) => {
    params.append(`options[${typeId}]`, optionId.toFixed());
  });
  return route('product.show', item.slug) + '?' + params.toString();
};
