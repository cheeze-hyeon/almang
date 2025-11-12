export interface CartItem {
  productId: string;
  name: string;
  volumeMl: number;
  unitPricePerMl: number;
  amount: number;
  measureUnit: "ml" | "g" | null;
}
