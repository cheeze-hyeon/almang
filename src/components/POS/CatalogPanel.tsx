"use client";

import { useMemo, useState } from "react";
import type { Product, ProductCategory } from "@/types";

const CAT_ORDER: { key: ProductCategory; label: string }[] = [
  { key: "shampoo", label: "샴푸" },
  { key: "body_handwash", label: "바디워시/핸드워시" },
  { key: "lotion_oil", label: "로션/오일" },
  { key: "cream_balm_gel_pack", label: "크림/밤/젤/팩" },
  { key: "cleansing", label: "클렌징 제품" },
  { key: "detergent", label: "세제" },
];

export default function CatalogPanel({
  products,
  activeCat,
  onChangeCat,
  onPick,
}: {
  products: Product[];
  activeCat: ProductCategory;
  onChangeCat: (c: ProductCategory) => void;
  onPick: (p: Product) => void;
}) {
  const [q, setQ] = useState("");

  const catProducts = useMemo(() => {
    const base = products.filter((p) => p.category === activeCat);
    if (!q.trim()) return base;
    const key = q.trim().toLowerCase();
    return base.filter(
      (p) => p.name.toLowerCase().includes(key) || (p.brand?.toLowerCase() ?? "").includes(key),
    );
  }, [products, activeCat, q]);

  return (
    <section className="col-span-7">
      {/* 헤더 */}
      <header className="mb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">알맹상점</h1>
            <p className="text-slate-500 text-sm">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="w-72">
            <div className="rounded-xl bg-slate-200/70 px-3 py-2 flex items-center gap-2">
              <span className="text-slate-500">🔎</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="상품검색"
                className="bg-transparent outline-none flex-1"
              />
            </div>
          </div>
        </div>

        {/* 카테고리 탭 */}
        <div className="mt-4 flex gap-5 overflow-x-auto pb-2">
          {CAT_ORDER.map((c) => (
            <button
              key={c.key}
              onClick={() => onChangeCat(c.key)}
              className={`pb-2 border-b-2 -mb-px text-sm md:text-base ${
                activeCat === c.key
                  ? "border-rose-500 text-rose-600 font-semibold"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </header>

      {/* 상품 카드 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {catProducts.map((p) => (
          <button
            key={p.id}
            onClick={() => onPick(p)}
            className="rounded-2xl bg-white shadow p-4 text-left hover:shadow-md transition"
          >
            {/* 이미지 자리 */}
            <div className="aspect-[3/4] rounded-xl bg-slate-200 flex items-center justify-center mb-3">
              <span className="text-slate-500">IMG</span>
            </div>
            <div className="font-semibold leading-tight">
              {p.brand ? `${p.brand} ` : ""}
              {p.name}
            </div>
            <div className="text-sm text-slate-500 mt-1">{p.unitPricePerMl.toLocaleString()}원</div>
          </button>
        ))}
      </div>
    </section>
  );
}
