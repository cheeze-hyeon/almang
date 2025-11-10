import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: "cust_001",
      name: "김민수",
      totalSpent: 182000,
      refillCount: 12,
      co2SavedKg: 3.2,
      grade: "Green",
      lastVisit: new Date().toISOString(),
    },
    {
      id: "cust_002",
      name: "박지현",
      totalSpent: 76000,
      refillCount: 5,
      co2SavedKg: 1.2,
      grade: "Leaf",
      lastVisit: new Date().toISOString(),
    },
  ]);
}
