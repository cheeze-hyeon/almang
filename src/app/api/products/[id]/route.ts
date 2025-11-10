import { NextResponse } from "next/server";
import type { Product } from "@/types/product";

// TODO: Supabase 연동으로 교체
const mockProducts: Record<string, Product> = {
  prd_olive: {
    id: "prd_olive",
    name: "올리브 샴푸",
    brand: "알맹",
    composition: "정제수, 올리브오일, 계면활성제...",
    ecoInfo: "재활용 용기, 생분해 성분 사용",
  },
  prd_detergent: {
    id: "prd_detergent",
    name: "에코 세제",
    brand: "알맹",
    composition: "계면활성제(식물기반), 향료...",
    ecoInfo: "저자극, 무인산염",
  },
};

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = mockProducts[id] ?? {
    id,
    name: "알 수 없는 상품",
  };
  return NextResponse.json(data satisfies Product);
}
