import { NextRequest, NextResponse } from "next/server";

// TODO: Supabase 연동으로 교체
const mockCustomers = [
  {
    id: "cust_001",
    name: "김민수",
    phone: "010-1234-5678",
    totalSpent: 182000,
    refillCount: 12,
    co2SavedKg: 3.2,
    grade: "Green",
    lastVisit: new Date().toISOString(),
  },
  {
    id: "cust_002",
    name: "박지현",
    phone: "010-9876-5432",
    totalSpent: 76000,
    refillCount: 5,
    co2SavedKg: 1.2,
    grade: "Leaf",
    lastVisit: new Date().toISOString(),
  },
];

// 고객 조회 (전화번호로)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "전화번호가 필요합니다." }, { status: 400 });
  }

  // 전화번호 형식 정규화 (하이픈 제거)
  const normalizedPhone = phone.replace(/-/g, "");

  // TODO: Supabase에서 실제 조회
  const customer = mockCustomers.find((c) => c.phone.replace(/-/g, "") === normalizedPhone);

  if (!customer) {
    return NextResponse.json({ error: "고객을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json(customer);
}

// 신규 고객 등록
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "이름과 전화번호가 필요합니다." }, { status: 400 });
    }

    // TODO: Supabase에 실제 등록
    const newCustomer = {
      id: `cust_${Date.now()}`,
      name,
      phone,
      totalSpent: 0,
      refillCount: 0,
      co2SavedKg: 0,
      grade: "Seed",
      lastVisit: new Date().toISOString(),
    };

    // mockCustomers.push(newCustomer); // 실제로는 DB에 저장

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
}

