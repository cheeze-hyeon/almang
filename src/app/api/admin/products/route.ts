import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { id: "prd_olive", name: "올리브 샴푸", stockMl: 12000, unitPricePerMl: 20, status: "on" },
    { id: "prd_detergent", name: "에코 세제", stockMl: 8000, unitPricePerMl: 20, status: "on" },
  ]);
}

// TODO: PATCH 구현 (권한 체크 및 Supabase 업데이트)
