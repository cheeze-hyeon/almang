import { NextResponse } from "next/server";
import type { Receipt } from "@/types/receipt";

// TODO: Supabase 연동으로 교체
const mockReceipt: Receipt = {
  id: "rcpt_123",
  customerId: "cust_001",
  paidAt: new Date().toISOString(),
  totalAmount: 9800,
  items: [
    {
      id: "itm_1",
      productId: "prd_olive",
      name: "올리브 샴푸",
      volumeMl: 350,
      unitPricePerMl: 20,
      amount: 7000,
    },
    {
      id: "itm_2",
      productId: "prd_detergent",
      name: "에코 세제",
      volumeMl: 140,
      unitPricePerMl: 20,
      amount: 2800,
      discount: 0,
    },
  ],
};

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // 실제 구현: Supabase에서 id로 조회
  const data = { ...mockReceipt, id } as Receipt;
  return NextResponse.json(data);
}
