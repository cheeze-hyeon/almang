import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase-client";
import type { CartItem } from "@/types/cart";
import type { ReceiptItem } from "@/types/receipt";

/**
 * 오프라인 결제 후, 스마트 영수증 발송 및 서버 기록용 API
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

    const customerIdNum = typeof customerId === "string" ? parseInt(customerId, 10) : customerId;
    if (isNaN(customerIdNum)) {
      return NextResponse.json({ error: "유효하지 않은 고객 ID입니다." }, { status: 400 });
    }

    // Receipt 생성
    const { data: receipt, error: receiptError } = await supabaseClient
      .from("receipt")
      .insert({
        customer_id: customerIdNum,
        visit_date: new Date().toISOString(),
        total_amount: totalAmount,
      })
      .select()
      .single();

    if (receiptError) {
      console.error("Supabase error (receipt):", receiptError);
      return NextResponse.json(
        { error: "영수증 저장 중 오류가 발생했습니다." },
        { status: 500 },
      );
    }

    // ReceiptItem 생성
    const receiptItems = await Promise.all(
      items.map(async (item: CartItem) => {
        // Product 정보 조회 (carbon emission 계산을 위해)
        const { data: product } = await supabaseClient
          .from("product")
          .select("current_carbon_emission")
          .eq("id", typeof item.productId === "string" ? parseInt(item.productId, 10) : item.productId)
          .single();

        const carbonEmissionPerMl = product?.current_carbon_emission
          ? product.current_carbon_emission / 1000 // kg/ml로 변환 (가정: 1L = 1000ml 기준)
          : null;

        const { data: receiptItem, error: itemError } = await supabaseClient
          .from("receipt_item")
          .insert({
            receipt_id: receipt.id,
            product_id: typeof item.productId === "string" ? parseInt(item.productId, 10) : item.productId,
            purchase_quantity_ml: item.volumeMl,
            purchase_unit_price_원_per_ml: item.unitPricePerMl,
            purchase_carbon_emission_base_kg_per_ml: carbonEmissionPerMl,
            total_carbon_emission_kg: carbonEmissionPerMl
              ? (carbonEmissionPerMl * item.volumeMl) / 1000
              : null,
          })
          .select()
          .single();

        if (itemError) {
          console.error("Supabase error (receipt_item):", itemError);
          throw itemError;
        }

        return receiptItem as ReceiptItem;
      }),
    );

    return NextResponse.json(
      {
        success: true,
        message: "결제 내역이 저장되었습니다. (오프라인 결제)",
        receipt: {
          id: receipt.id,
          createdAt: receipt.visit_date,
        },
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
