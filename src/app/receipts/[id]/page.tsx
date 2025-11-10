import Link from "next/link";
import type { Receipt } from "@/types/receipt";
import { getBaseUrl } from "@/lib/env";

async function getReceipt(id: string): Promise<Receipt> {
  const mock: Receipt = {
    id,
    customerId: "cust_001",
    paidAt: new Date().toISOString(),
    totalAmount: 9800,
    items: [
      {
        id: "itm_1",
        productId: "prd_olive",
        name: "올리브 샴푸",
        volumeMl: 350,
        unitPricePerMl: 20,
        amount: 7000,
      },
      {
        id: "itm_2",
        productId: "prd_detergent",
        name: "에코 세제",
        volumeMl: 140,
        unitPricePerMl: 20,
        amount: 2800,
      },
    ],
  };

  try {
    const res = await fetch(`${getBaseUrl()}/api/receipts/${id}`, { cache: "no-store" });
    if (!res.ok) return mock;
    return res.json();
  } catch {
    return mock;
  }
}

function formatCurrency(krw: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(krw);
}

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const receipt = await getReceipt(id);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <header className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">스마트 영수증</h1>
        <p className="text-sm text-slate-500">
          결제 일시: {new Date(receipt.paidAt).toLocaleString("ko-KR")} · 총액{" "}
          <strong className="text-slate-900">{formatCurrency(receipt.totalAmount)}</strong>
        </p>
      </header>

      <section className="space-y-3">
        {receipt.items.map((item) => (
          <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">
                  용량 {item.volumeMl} ml · 단가 {item.unitPricePerMl} 원/ml
                </p>
              </div>
              <p className="text-sm font-medium text-slate-900">{formatCurrency(item.amount)}</p>
            </div>
            <div className="mt-3">
              <Link
                href={`/products/${item.productId}`}
                className="text-sm font-semibold text-emerald-700 hover:underline"
              >
                상세 보기
              </Link>
            </div>
          </article>
        ))}
      </section>

      <footer className="mt-8 flex justify-end">
        <Link
          href="/api/auth/kakao/login"
          className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
        >
          나의 히스토리 보기
        </Link>
      </footer>
    </main>
  );
}
