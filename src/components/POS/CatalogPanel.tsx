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
  conditioner: "컨디셔너",
  body_handwash: "바디워시/핸드워시",
  lotion_oil: "로션/오일",
  cream_balm_gel_pack: "크림/밤/젤/팩",
  cleansing: "클렌징 제품",
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

  const formatUnitPrice = (price: number) => {
    return `${Math.round(price)}원/g`;
  };

  return (
    <div className="w-full pl-2 md:pl-3 lg:pl-4">
      {/* 상단 카테고리 탭 */}
      <div className="mb-6 md:mb-8">
        <div className="relative">
          <div className="overflow-x-auto pb-2 -mx-2 md:-mx-3 lg:-mx-4 px-2 md:px-3 lg:px-4 scrollbar-hide">
            <div className="flex gap-4 md:gap-6 lg:gap-8 min-w-max">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                const isActive = activeCat === key;
                return (
                  <div key={key} className="h-[33px] relative flex-shrink-0">
                    <button
                      onClick={() => onChangeCat(key as ProductCategory)}
                      className={`text-sm font-semibold text-left whitespace-nowrap ${
                        isActive ? "text-[#e75251]" : "text-black"
                      }`}
                    >
                      {label}
                    </button>
                    {isActive && (
                      <div className="absolute left-0 right-0 top-[30px] h-0.5 bg-[#E75251]"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute left-0 right-0 top-[32px] h-px bg-[#393C49] pointer-events-none"></div>
        </div>
      </div>

      {/* 상품 카드 그리드 */}
      {filtered.length === 0 ? (
        <p className="text-slate-400 text-sm mt-6">해당 카테고리에 등록된 상품이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-7">
          {filtered.map((p) => {
            // current_price는 g당 단가
            const unitPricePerG = p.current_price || 0;
            return (
              <button
                key={p.id}
                onClick={() => onPick(p)}
                className="relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 md:p-6 flex flex-col items-center min-h-[260px]"
              >
                {/* 이미지 원형 배경 */}
                <div className="relative -mt-8 mb-4">
                  <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-white border-2 border-gray-100 shadow-sm flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-500 text-xs">IMG</span>
                    </div>
                  </div>
                </div>

                {/* 브랜드명 */}
                <p className="text-sm font-medium text-black mb-2 text-center min-h-[1.25rem]">
                  {p.brand || "\u00A0"}
                </p>

                {/* 제품명 */}
                <p className="text-sm md:text-base font-medium text-black mb-2 text-center line-clamp-2">
                  {p.name || "상품명 없음"}
                </p>

                {/* 단가 */}
                <p className="text-sm text-black text-center mt-auto">
                  {formatUnitPrice(unitPricePerG)}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
