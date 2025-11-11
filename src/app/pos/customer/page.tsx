"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Customer } from "@/types";
import PhoneKeypad from "@/components/PhoneKeypad";

export default function CustomerPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("010"); // 숫자만 보관
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    if (phone.length < 10) {
      setError("전화번호 10~11자리를 입력해 주세요.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/pos/customers?phone=${encodeURIComponent(phone)}`);
      if (!r.ok) throw await r.json();
      const c: Customer = await r.json();
      router.push(`/pos/checkout?customerId=${c.id}`);
    } catch (e: any) {
      setError(e?.error ?? "고객을 찾을 수 없습니다. 신규 등록해 주세요.");
    } finally {
      setLoading(false);
    }
  };

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
      router.push(`/pos/checkout?customerId=${c.id}`);
    } catch (e: any) {
      setError(e?.error ?? "고객 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-amber-50 px-4 md:px-6 lg:px-8 py-6 md:py-8">
      <div className="mx-auto mb-4 md:mb-6 max-w-xl md:max-w-2xl lg:max-w-3xl text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">알록: 스마트 영수증</h1>
        <p className="text-slate-600 mt-1 md:mt-2 text-sm md:text-base">
          휴대폰 번호만 입력하면, 스마트 영수증을 발송해드려요!
        </p>
      </div>

      <PhoneKeypad
        value={phone}
        onChange={setPhone}
        onSubmit={search}
        ctaLabel="조회"
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
