import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    totalCustomers: 1245,
    totalRevenue: 258000000,
    totalRefills: 9820,
    co2SavedKg: 1342,
  });
}
