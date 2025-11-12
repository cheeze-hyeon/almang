import Link from "next/link";
import type { Receipt } from "@/types/receipt";
import { getBaseUrl } from "@/lib/env";

type ReceiptWithItems = Receipt & {
  items: Array<{
    id: number;
    product_id: number | null;
    purchase_quantity_ml: number | null;
    purchase_unit_price_원_per_ml: number | null;
    name?: string;
  }>;
};

async function getReceipt(id: string): Promise<ReceiptWithItems> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/receipts/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch receipt");
    return res.json();
  } catch {
    // Fallback
    return {
      id: parseInt(id, 10) || 0,
      customer_id: null,
      visit_date: new Date().toISOString(),
      total_amount: 0,
      items: [],
    };
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
          결제 일시: {receipt.visit_date ? new Date(receipt.visit_date).toLocaleString("ko-KR") : "날짜 없음"} · 총액{" "}
          <strong className="text-slate-900">{formatCurrency(receipt.total_amount || 0)}</strong>
        </p>
      </header>

      <section className="space-y-3">
        {receipt.items?.map((item) => {
          const quantity = item.purchase_quantity_ml || 0;
          const unitPrice = item.purchase_unit_price_원_per_ml || 0;
          const amount = quantity * unitPrice;
          return (
            <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{item.name || `상품 ${item.product_id}`}</p>
                  <p className="text-xs text-slate-500">
                    용량 {quantity} ml · 단가 {unitPrice.toLocaleString()} 원/ml
                  </p>
                </div>
                <p className="text-sm font-medium text-slate-900">{formatCurrency(amount)}</p>
              </div>
              <div className="mt-3">
                <Link
                  href={`/products/${item.product_id}`}
                  className="text-sm font-semibold text-emerald-700 hover:underline"
                >
                  상세 보기
                </Link>
              </div>
            </article>
          );
        })}
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
