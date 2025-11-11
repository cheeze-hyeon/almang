"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product, ProductCategory, Customer, CartItem } from "@/types";
import SidebarDummy from "@/components/POS/SidebarDummy";
import CatalogPanel from "@/components/POS/CatalogPanel";
import OrderPanel from "@/components/POS/OrderPanel";
import QuantityModal, { Unit } from "@/components/POS/QuantityModal";

type CartRow = CartItem & { id: string };

export default function CheckoutPage() {
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

  useEffect(() => {
    if (!customerId) return;
    (async () => {
      try {
        // 고객은 id/phone 둘 다 대응 가능한 핸들러가 이상적
        const [cR, pR] = await Promise.all([
          fetch(`/api/pos/customers?id=${customerId}`).then((r) => (r.ok ? r.json() : null)),
          fetch(`/api/pos/products`).then((r) => r.json()),
        ]);
        if (cR) setCustomer(cR);
        setProducts(pR);
      } catch {
        /* noop */
      }
    })();
  }, [customerId]);

  const pickProduct = (p: Product) => {
    setModalTarget(p);
    setModalOpen(true);
  };

  const addToCart = ({ volume, unit }: { volume: number; unit: Unit }) => {
    if (!modalTarget) return;
    const volMl = volume; // g/ml 동일 단가 가정
    const amount = volMl * modalTarget.unitPricePerMl;
    const row: CartRow = {
      id: `${modalTarget.id}_${Date.now()}`,
      productId: modalTarget.id,
      name: modalTarget.name,
      volumeMl: volMl,
      unitPricePerMl: modalTarget.unitPricePerMl,
      amount,
    };
    setCart((prev) => [...prev, row]);
  };

  const removeRow = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));

  const pay = async () => {
    if (!customer || cart.length === 0) return;
    const body = { customerId: customer.id, items: cart, totalAmount: subTotal - discount };
    const r = await fetch("/api/pos/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (r.ok) {
      alert(`결제 완료: ${data.receipt.id}`);
      setCart([]);
      router.replace("/pos/customer");
    } else {
      alert(data.error ?? "결제 실패");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-[1200px] xl:max-w-[1400px] p-4">
        <div className="grid grid-cols-12 gap-4">
          <SidebarDummy />

          <CatalogPanel
            products={products}
            activeCat={activeCat}
            onChangeCat={setActiveCat}
            onPick={pickProduct}
          />

          <OrderPanel
            customer={customer}
            cart={cart}
            onRemove={removeRow}
            subTotal={subTotal}
            discount={discount}
            onPay={pay}
          />
        </div>
      </div>

      <QuantityModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalTarget(null);
        }}
        onConfirm={addToCart}
        defaultUnit="g"
        unitPrice={modalTarget?.unitPricePerMl ?? 0}
      />
    </main>
  );
}
