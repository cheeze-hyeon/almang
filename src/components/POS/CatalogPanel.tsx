"use client";

import { useMemo } from "react";
import type { Product, ProductCategory } from "@/types";

interface CatalogPanelProps {
  products: Product[];
  activeCat: ProductCategory;
  onChangeCat: (cat: ProductCategory) => void;
  onPick: (product: Product) => void;
}

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  shampoo: "샴푸",
  body_handwash: "바디워시/핸드워시",
  lotion_oil: "로션/오일",
  cream_balm_gel_pack: "크림/팩",
  cleansing: "클렌징",
  detergent: "세제",
};

export default function CatalogPanel({
  products,
  activeCat,
  onChangeCat,
  onPick,
}: CatalogPanelProps) {
  // ✅ category가 없는 상품은 기본값 'shampoo'로 매핑 (안정성 확보)
  const normalized = useMemo(
    () => products.map((p) => (p.category ? p : ({ ...p, category: "shampoo" } as Product))),
    [products],
  );

  // ✅ 카테고리 필터링
  const filtered = normalized.filter((p) => p.category === activeCat);

  return (
    <section className="col-span-7">
      {/* 상단 카테고리 탭 */}
      <div className="mb-5 flex gap-5 overflow-x-auto pb-2 border-b border-slate-200">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onChangeCat(key as ProductCategory)}
            className={`pb-2 border-b-2 text-sm md:text-base ${
              activeCat === key
                ? "border-rose-500 text-rose-600 font-semibold"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 상품 카드 그리드 */}
      {filtered.length === 0 ? (
        <p className="text-slate-400 text-sm mt-6">해당 카테고리에 등록된 상품이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => onPick(p)}
              className="rounded-2xl bg-white shadow p-4 text-left hover:shadow-md transition"
            >
              {/* 이미지 자리 */}
              <div className="aspect-[3/4] rounded-xl bg-slate-200 flex items-center justify-center mb-3">
                <span className="text-slate-500 text-sm">IMG</span>
              </div>

              <div className="font-semibold leading-tight">
                {p.brand ? `${p.brand} ` : ""}
                {p.name}
              </div>
              <div className="text-sm text-slate-500 mt-1">
                {p.unitPricePerMl.toLocaleString()}원/ml
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
