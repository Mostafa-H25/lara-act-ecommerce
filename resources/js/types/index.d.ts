import { Config } from 'ziggy-js';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
}

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  csrf_token: string;
  auth: {
    user: User;
  };
  ziggy: Config & { location: string };
  totalPrice: number;
  totalQuantity: number;
  miniCartItems: CartItem[];
  success: [message: string, time: number];
  error: string;
  error: string;
};

export type CartItem = {
  id: number;
  product_id: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  option_ids: Record<string, number>;
  options: VariationTypeOption[];
};
export type GroupedCartItem = {
  user: User;
  totalPrice: number;
  totalQuantity: number;
  items: CartItem[];
};

export type VariationTypeOption = {
  id: number;
  name: string;
  images?: Image[];
  type: VariationType;
};

export type VariationType = {
  id: number;
  name: string;
  type: 'select' | 'radio' | 'image';
  options: VariationTypeOption[];
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  images: Image[];
  description: string;
  short_description: string;
  user: {
    id: number;
    name: string;
  };
  department: {
    id: number;
    name: string;
  };
  variationTypes: VariationType[];
  variations: {
    id: number;
    variation_type_option_ids: number[];
    quantity: number;
    price: number;
  }[];
};

export type PaginatedData<T> = {
  data: Array<T>;
};

export type Image = {
  id: number;
  thumb: string;
  small: string;
  large: string;
};

export type orderItem = {
  id: number;
  quantity: number;
  price: number;
  variation_type_option_ids: number[];
  product: {
    id: number;
    title: string;
    slug: string;
    description: string;
    image: string;
  };
};

export type Order = {
  id: number;
  total_price: number;
  status: string;
  created_at: string;
  orderItems: OrderItem[];
  vendorUser: {
    id: string;
    name: string;
    email: string;
    store_name: string;
    store_address: string;
  };
};
