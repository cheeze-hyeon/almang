"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Customer, Product, CartItem } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const customerId = sp.get("customerId");

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const totalAmount = cart.reduce((s, i) => s + i.amount, 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 고객 & 상품 로드
  useEffect(() => {
    if (!customerId) {
      router.replace("/pos/customer");
      return;
    }
    (async () => {
      try {
        const [cR, pR] = await Promise.all([
          fetch(`/api/pos/customers?id=${customerId}`),
          fetch("/api/pos/products"),
        ]);
        if (!cR.ok) throw await cR.json();
        const c: Customer = await cR.json();
        setCustomer(c);
        const p: Product[] = await pR.json();
        setProducts(p);
      } catch (e: any) {
        setError(e?.error ?? "데이터 로드 실패");
      }
    })();
  }, [customerId, router]);

  const addItem = (p: Product, volumeMl: number) => {
    const item: CartItem = {
      productId: p.id,
      name: p.name,
      volumeMl,
      unitPricePerMl: p.unitPricePerMl,
      amount: volumeMl * p.unitPricePerMl,
    };
    setCart((prev) => [...prev, item]);
  };

  const pay = async () => {
    if (!customer || cart.length === 0) return;
    if (!confirm("결제를 완료하시겠습니까?")) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/pos/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: customer.id, items: cart, totalAmount }),
      });
      if (!r.ok) throw await r.json();
      const data = await r.json();
      alert(`결제 완료!\n영수증 ID: ${data.receipt.id}`);
      router.replace("/pos/customer"); // 초기 흐름으로 복귀
    } catch (e: any) {
      setError(e?.error ?? "결제 처리 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">결제(수량·가격 계산)</h1>

      {/* 고객 박스 */}
      {customer && (
        <div className="mb-4 rounded bg-green-50 p-3">
          <div className="font-semibold">{customer.name}</div>
          <div className="text-sm text-green-700">
            등급: {customer.grade} · 리필 {customer.refillCount}회
          </div>
        </div>
      )}

      {/* 상품 픽커(간단버전) */}
      <div className="mb-3 flex gap-2 flex-wrap">
        {products.map((p) => (
          <button key={p.id} onClick={() => addItem(p, 100)} className="border rounded px-3 py-2">
            {p.name} (기본 100ml 추가)
          </button>
        ))}
      </div>

      {/* 장바구니 */}
      {cart.length === 0 ? (
        <p className="text-gray-500">장바구니가 비었습니다.</p>
      ) : (
        <div className="space-y-2">
          {cart.map((i, idx) => (
            <div key={idx} className="flex justify-between border p-2 rounded">
              <div>
                <div className="font-medium">{i.name}</div>
                <div className="text-sm text-gray-500">
                  {i.volumeMl}ml × {i.unitPricePerMl.toLocaleString()}원/ml
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{i.amount.toLocaleString()}원</span>
                <button
                  onClick={() => setCart(cart.filter((_, k) => k !== idx))}
                  className="text-red-600"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 합계/결제 */}
      <div className="mt-4 flex items-center justify-between rounded bg-blue-600 text-white px-4 py-3">
        <span className="font-semibold">총 결제 금액</span>
        <span className="text-xl font-bold">{totalAmount.toLocaleString()}원</span>
      </div>
      <button
        onClick={pay}
        disabled={!customer || cart.length === 0 || loading}
        className="mt-3 w-full rounded bg-indigo-600 text-white py-3 disabled:opacity-50"
      >
        결제 완료
      </button>

      {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
    </main>
  );
}
