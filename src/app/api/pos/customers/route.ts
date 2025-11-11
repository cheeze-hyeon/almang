import { NextRequest, NextResponse } from "next/server";

// 인메모리 Mock DB (dev 서버가 켜져 있는 동안만 유지)
type Customer = {
  id: string;
  name: string;
  phone: string; // 항상 '숫자만'으로 저장 (예: "01012345678")
  totalSpent: number;
  refillCount: number;
  co2SavedKg: number;
  grade: string;
  lastVisit: string;
};

const normalizePhone = (s: string) => s.replace(/\D/g, "").slice(0, 11);

// 초기 더미 (전화번호는 숫자만으로 통일 권장)
const mockCustomers: Customer[] = [
  {
    id: "cust_001",
    name: "김민수",
    phone: "01012345678", // ← 숫자만
    totalSpent: 182000,
    refillCount: 12,
    co2SavedKg: 3.2,
    grade: "Green",
    lastVisit: new Date().toISOString(),
  },
  {
    id: "cust_002",
    name: "박지현",
    phone: "01098765432", // ← 하이픈 제거해 통일
    totalSpent: 76000,
    refillCount: 5,
    co2SavedKg: 1.2,
    grade: "Leaf",
    lastVisit: new Date().toISOString(),
  },
];

// GET /api/pos/customers?id=...  또는  /api/pos/customers?phone=...
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const id = sp.get("id");
  const phone = sp.get("phone");

  // 1) id 우선 처리
  if (id) {
    const found = mockCustomers.find((c) => c.id === id);
    if (!found) {
      return NextResponse.json({ error: "고객을 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json(found);
  }

  // 2) phone 처리
  if (phone) {
    const key = normalizePhone(phone);
    const found = mockCustomers.find((c) => c.phone === key);
    if (!found) {
      return NextResponse.json({ error: "고객을 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json(found);
  }

  // 3) 둘 다 없으면 400
  return NextResponse.json({ error: "id 또는 phone 쿼리가 필요합니다." }, { status: 400 });
}

// POST /api/pos/customers  { name, phone }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone } = body || {};
    if (!name || !phone) {
      return NextResponse.json({ error: "이름과 전화번호가 필요합니다." }, { status: 400 });
    }

    const key = normalizePhone(phone);

    // 중복 방지: 이미 있으면 그대로 반환(등록 → 즉시 조회 플로우 원활)
    const existing = mockCustomers.find((c) => c.phone === key);
    if (existing) return NextResponse.json(existing, { status: 200 });

    const created: Customer = {
      id: `cust_${Date.now()}`,
      name,
      phone: key, // 숫자만 저장
      totalSpent: 0,
      refillCount: 0,
      co2SavedKg: 0,
      grade: "Seed",
      lastVisit: new Date().toISOString(),
    };

    // ✅ 실제로 mock에 추가
    mockCustomers.push(created);

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }
}
