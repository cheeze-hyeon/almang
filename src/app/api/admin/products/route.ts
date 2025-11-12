import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase-client";
import type { Product } from "@/types/product";

export async function GET() {
  try {
    const { data, error } = await supabaseClient
      .from("product")
      .select("*")
      .order("id", { ascending: true });

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

// TODO: PATCH 구현 (권한 체크 및 Supabase 업데이트)
