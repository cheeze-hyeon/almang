import { NextRequest, NextResponse } from "next/server";

/**
 * 오프라인 결제 후, 스마트 영수증 발송 및 서버 기록용 mock API
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, items, totalAmount } = body;

    // ✅ 필수 데이터 검증
    if (!customerId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    if (typeof totalAmount !== "number" || totalAmount <= 0) {
      return NextResponse.json({ error: "결제 금액이 올바르지 않습니다." }, { status: 400 });
    }

    // ✅ 영수증 mock 데이터 생성
    const receipt = {
      id: `rcpt_${Date.now()}`,
      customerId,
      items,
      totalAmount,
      paidAt: new Date().toISOString(),
      method: "offline-pos", // 실제 결제는 오프라인
    };

    // ✅ TODO: 추후 Supabase 연동 시 실제 DB 저장
    // await supabase.from("receipts").insert(receipt);
    // await supabase.rpc("update_customer_stats", { customerId, amount: totalAmount });

    console.log("💾 [Mock Receipt Saved]", receipt);

    return NextResponse.json(
      {
        success: true,
        message: "결제 내역이 저장되었습니다. (오프라인 결제)",
        receipt,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ 결제 처리 오류:", error);
    return NextResponse.json(
      { error: "결제 데이터 저장 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
