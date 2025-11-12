import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase-client";
import type { Customer } from "@/types/customer";

// GET /api/pos/customers?id=...
export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const id = sp.get("id");

    if (!id) {
      return NextResponse.json({ error: "id 쿼리가 필요합니다." }, { status: 400 });
    }

    const customerId = parseInt(id, 10);
    if (isNaN(customerId)) {
      return NextResponse.json({ error: "유효하지 않은 고객 ID입니다." }, { status: 400 });
    }

    const { data, error } = await supabaseClient
      .from("customer")
      .select("*")
      .eq("id", customerId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "고객을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json(data as Customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json({ error: "고객 조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}

// POST /api/pos/customers  { name, kakao_id? }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, kakao_id } = body || {};

    if (!name) {
      return NextResponse.json({ error: "이름이 필요합니다." }, { status: 400 });
    }

    // kakao_id로 중복 체크
    if (kakao_id) {
      const { data: existing } = await supabaseClient
        .from("customer")
        .select("*")
        .eq("kakao_id", kakao_id)
        .single();

      if (existing) {
        return NextResponse.json(existing as Customer, { status: 200 });
      }
    }

    const { data, error } = await supabaseClient
      .from("customer")
      .insert({
        name,
        kakao_id: kakao_id || null,
        gender: null,
        birth_date: null,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "고객 생성 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json(data as Customer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
}
