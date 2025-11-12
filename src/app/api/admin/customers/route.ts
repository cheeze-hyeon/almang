import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase-client";
import type { Customer } from "@/types/customer";

export async function GET() {
  try {
    const { data, error } = await supabaseClient
      .from("customer")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: "고객 조회 중 오류가 발생했습니다." }, { status: 500 });
    }

    return NextResponse.json(data as Customer[]);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "고객 조회 중 오류가 발생했습니다." }, { status: 500 });
  }
}
