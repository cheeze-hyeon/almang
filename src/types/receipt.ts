export type ReceiptItem = {
  id: string;
  productId: string;
  name: string;
  volumeMl: number;
  unitPricePerMl: number; // 원/ml
  amount: number; // 원
  discount?: number; // 원, optional
};

export type Receipt = {
  id: string;
  customerId?: string | null;
  paidAt: string; // ISO string
  totalAmount: number; // 원
  items: ReceiptItem[];
};
