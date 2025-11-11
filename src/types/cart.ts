export interface CartItem {
  productId: string;
  name: string;
  volumeMl: number;
  unitPricePerMl: number;
  amount: number; // 표시용 합계 (서버에서 최종 재계산 권장)
}
