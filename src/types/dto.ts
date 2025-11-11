import type { CartItem } from "./cart";
import type { Customer } from "./customer";
import type { Product } from "./product";

export interface GetCustomerByPhoneQuery {
  phone: string;
}
export interface GetCustomerByIdQuery {
  id: string;
}

export interface CreateCustomerBody {
  name: string;
  phone: string;
}
export type CreateCustomerResponse = Customer;

export type ProductsResponse = Product[];

export interface PaymentBody {
  customerId: string;
  items: CartItem[];
  totalAmount: number; // 서버에서 반드시 검증/재계산
}
export interface PaymentResponse {
  receipt: { id: string; createdAt?: string };
}
