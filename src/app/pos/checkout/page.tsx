"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product, ProductCategory, Customer, CartItem } from "@/types";
import CatalogPanel from "@/components/POS/CatalogPanel";
import OrderPanel from "@/components/POS/OrderPanel";
import QuantityModal, { Unit } from "@/components/POS/QuantityModal";
import Header from "@/components/POS/Header";

type CartRow = CartItem & { id: string };

function CheckoutContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const customerId = sp.get("customerId");

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCat, setActiveCat] = useState<ProductCategory>("shampoo");

  // 장바구니
  const [cart, setCart] = useState<CartRow[]>([]);
  const subTotal = useMemo(() => cart.reduce((s, i) => s + i.amount, 0), [cart]);
  const discount = 0;

  // 모달 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<Product | null>(null);

  // 🔸 고객 + 상품 불러오기
  useEffect(() => {
    (async () => {
      try {
        const promises = [fetch(`/api/pos/products`).then((r) => r.json())];

        // customerId가 있을 때만 고객 정보 조회
        if (customerId) {
          promises.push(
            fetch(`/api/pos/customers?id=${customerId}`).then((r) => (r.ok ? r.json() : null)),
          );
        }

        const results = await Promise.all(promises);
        setProducts(results[0]);

        // customerId가 있으면 고객 정보 설정
        if (customerId && results[1]) {
          setCustomer(results[1]);
        }
      } catch {
        /* noop */
      }
    })();
  }, [customerId]);

  // 🔸 상품 선택 시 모달 오픈
  const pickProduct = (p: Product) => {
    setModalTarget(p);
    setModalOpen(true);
  };

  // 🔸 장바구니 추가
  const addToCart = ({ volume, unit }: { volume: number; unit: Unit }) => {
    if (!modalTarget) return;
    const volMl = volume; // g/ml 동일 단가 가정
    // current_price는 이미 ml당 단가이므로 그대로 사용
    const unitPricePerMl = modalTarget.current_price || 0;
    const amount = volMl * unitPricePerMl;
    const row: CartRow = {
      id: `${modalTarget.id}_${Date.now()}`,
      productId: String(modalTarget.id),
      name: modalTarget.name || "상품명 없음",
      volumeMl: volMl,
      unitPricePerMl,
      amount,
      measureUnit: modalTarget.measure_unit,
    };
    setCart((prev) => [...prev, row]);
  };

  // 🔸 장바구니 아이템 제거
  const removeRow = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));

  // 🔸 고객 전화번호 입력 페이지로 이동 (결제 대체)
  const goToPhoneInput = () => {
    if (cart.length === 0) return alert("장바구니가 비어 있습니다.");
    // 장바구니 데이터를 localStorage에 저장
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("total", String(subTotal - discount));

    // 고객 전화번호 입력 페이지로 이동
    router.push(`/pos/customer`);
  };

  // 🔸 localStorage에 장바구니 자동 저장 (새로고침 대비)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <main className="min-h-screen bg-[#F2F2F7] flex flex-col">
      {/* 헤더 */}
      <Header />

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8 px-4 md:px-6 lg:px-8 pb-6 md:pb-8">
        {/* 상품 카탈로그 */}
        <div className="flex-1 min-w-0">
          <CatalogPanel
            products={products}
            activeCat={activeCat}
            onChangeCat={setActiveCat}
            onPick={pickProduct}
          />
        </div>

        {/* 우측 주문 패널 */}
        <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
          <OrderPanel
            customer={customer}
            cart={cart}
            onRemove={removeRow}
            subTotal={subTotal}
            discount={discount}
            onPay={goToPhoneInput} // ✅ 결제 대신 고객입력 페이지 이동
          />
        </div>
      </div>

      {/* 용량 입력 모달 */}
      <QuantityModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalTarget(null);
        }}
        onConfirm={addToCart}
        defaultUnit={(modalTarget?.measure_unit as Unit) || "g"}
        unitPrice={modalTarget?.current_price || 0}
      />
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-100 flex items-center justify-center">
          <div className="text-slate-600">로딩 중...</div>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
