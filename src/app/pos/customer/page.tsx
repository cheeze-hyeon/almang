"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Customer, CartItem } from "@/types";
import PhoneKeypad from "@/components/PhoneKeypad";

export default function CustomerPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("010");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 checkout에서 넘어온 장바구니 및 총 금액
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      const storedTotal = localStorage.getItem("total");
      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedTotal) setTotal(Number(storedTotal));
    } catch {
      /* noop */
    }
  }, []);

  // 🔹 고객 정보 조회
  const search = async () => {
    if (phone.length < 10) {
      setError("전화번호 10~11자리를 입력해 주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // TODO: phone으로 고객 조회하는 API가 필요함 (현재는 id만 지원)
      // 임시로 신규 등록으로 처리
      setError("전화번호 검색은 아직 지원되지 않습니다. 신규 등록을 이용해주세요.");
    } catch (e: any) {
      setError(e?.error ?? "고객을 찾을 수 없습니다. 신규 등록해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 신규 고객 등록
  const registerCustomer = async () => {
    const name = prompt("고객 이름을 입력해주세요:");
    if (!name) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/pos/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      if (!r.ok) throw await r.json();
      const c: Customer = await r.json();

      // 등록 후 바로 결제 데이터 저장
      await saveOrder(String(c.id));
    } catch (e: any) {
      setError(e?.error ?? "고객 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 서버에 결제 데이터 저장 (실제 결제는 아님)
  const saveOrder = async (customerId: string | number) => {
    if (cart.length === 0) {
      alert("결제할 상품이 없습니다.");
      return;
    }

    const body = {
      customerId,
      items: cart,
      totalAmount: total,
    };

    try {
      const r = await fetch("/api/pos/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (r.ok) {
        alert("스마트 영수증이 발송되었습니다!");
        // 로컬 스토리지 비우고 홈으로
        localStorage.removeItem("cart");
        localStorage.removeItem("total");
        router.push("/pos/checkout");
      } else {
        alert(data.error ?? "영수증 발송 실패");
      }
    } catch {
      alert("서버 통신 오류가 발생했습니다.");
    }
  };

  return (
    <main className="min-h-screen bg-amber-50 px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="mx-auto mb-4 md:mb-6 max-w-xl md:max-w-2xl lg:max-w-3xl text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">알록: 스마트 영수증</h1>
        <p className="text-slate-600 mt-1 md:mt-2 text-sm md:text-base">
          결제 금액은{" "}
          <span className="font-semibold text-rose-600">{total.toLocaleString()}원</span>입니다.
        </p>
        <p className="text-slate-500 mt-1 text-xs md:text-sm">
          휴대폰 번호를 입력하면 스마트 영수증을 발송해드려요!
        </p>
      </div>

      <PhoneKeypad
        value={phone}
        onChange={setPhone}
        onSubmit={search}
        ctaLabel="영수증 발송"
        loading={loading}
        prefix="010"
      />

      <div className="mx-auto mt-3 md:mt-4 max-w-xl md:max-w-2xl lg:max-w-3xl text-center text-sm text-red-600">
        {error}
      </div>

      <div className="mx-auto mt-4 max-w-md">
        <button
          onClick={registerCustomer}
          disabled={loading || phone.length < 10}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium hover:bg-slate-50 disabled:opacity-50"
        >
          신규 고객 등록
        </button>
      </div>
    </main>
  );
}
