import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase-client";
import type { Product } from "@/types/product";

// 상품 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = supabaseClient
      .from("product")
      .select("*")
      .not("name", "is", null)
      .not("current_price", "is", null)
      .gt("current_price", 0);

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "상품 조회 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json(data as Product[]);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "상품 조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}
