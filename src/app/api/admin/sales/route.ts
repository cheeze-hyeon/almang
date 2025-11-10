import { NextResponse } from "next/server";

// Mock: 인기 상품별 매출 (단위: 원)
export async function GET() {
  return NextResponse.json({
    labels: ["올리브 샴푸", "에코 세제", "바디워시", "섬유유연제"],
    values: [7200000, 5400000, 3100000, 2800000],
  });
}
