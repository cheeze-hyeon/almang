import { NextResponse } from "next/server";

// TODO: Supabase 연동으로 교체
const mockProducts = [
  {
    id: "prd_olive",
    name: "올리브 샴푸",
    stockMl: 12000,
    unitPricePerMl: 20,
    status: "on",
  },
  {
    id: "prd_detergent",
    name: "에코 세제",
    stockMl: 8000,
    unitPricePerMl: 20,
    status: "on",
  },
  {
    id: "prd_conditioner",
    name: "헤어 컨디셔너",
    stockMl: 10000,
    unitPricePerMl: 25,
    status: "on",
  },
];

// 상품 목록 조회
export async function GET() {
  // TODO: Supabase에서 실제 조회
  // 재고가 있는 상품만 반환
  const availableProducts = mockProducts.filter((p) => p.status === "on" && p.stockMl > 0);

  return NextResponse.json(availableProducts);
}

