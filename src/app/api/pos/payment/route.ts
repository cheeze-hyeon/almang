import { NextRequest, NextResponse } from "next/server";

// 결제 완료 처리
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, items, totalAmount } = body;

    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    if (totalAmount <= 0) {
      return NextResponse.json({ error: "결제 금액이 올바르지 않습니다." }, { status: 400 });
    }

    // TODO: Supabase에 실제 결제 정보 저장
    // 1. 영수증(receipts) 생성
    // 2. 상품 재고(stock) 차감
    // 3. 고객 정보 업데이트 (totalSpent, refillCount 등)

    const receipt = {
      id: `rcpt_${Date.now()}`,
      customerId,
      items,
      totalAmount,
      paidAt: new Date().toISOString(),
    };

    // 실제로는 DB에 저장
    // const { data, error } = await supabase.from('receipts').insert(receipt);

    return NextResponse.json(
      {
        success: true,
        receipt,
        message: "결제가 완료되었습니다.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("결제 처리 오류:", error);
    return NextResponse.json({ error: "결제 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}

