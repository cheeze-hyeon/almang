"use client";

import type { Customer, CartItem } from "@/types";

type CartRow = CartItem & { id: string };

export default function OrderPanel({
  customer,
  cart,
  onRemove,
  subTotal,
  discount = 0,
  onPay,
}: {
  customer: Customer | null;
  cart: CartRow[];
  onRemove: (id: string) => void;
  subTotal: number;
  discount?: number;
  onPay: () => void;
}) {
  return (
    <aside className="col-span-4">
      <div className="sticky top-4 rounded-2xl bg-white shadow p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Orders</h2>
          <div className="text-slate-500 text-sm">{customer?.name ?? "고객 선택 없음"}</div>
        </div>
        <hr className="my-3" />

        {/* 장바구니 */}
        <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
          {cart.length === 0 ? (
            <p className="text-slate-400 text-sm">왼쪽에서 상품을 선택해 담아주세요.</p>
          ) : (
            cart.map((row) => (
              <div key={row.id} className="flex items-center gap-3">
                {/* 썸네일 자리 */}
                <div className="w-10 h-10 rounded bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                  IMG
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium line-clamp-1">{row.name}</div>
                  <div className="text-xs text-slate-500">친환경/비건</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{row.volumeMl}g</div>
                  <div className="text-sm tabular-nums">{row.amount.toLocaleString()}</div>
                </div>
                <button
                  onClick={() => onRemove(row.id)}
                  className="w-9 h-9 rounded-xl border text-rose-500 border-rose-200 hover:bg-rose-50"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        <hr className="my-3" />
        <div className="space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Discount</span>
            <span className="tabular-nums">{discount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Sub total</span>
            <span className="tabular-nums font-semibold">
              {(subTotal - discount).toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={onPay}
          disabled={!customer || cart.length === 0}
          className="mt-4 w-full rounded-xl bg-rose-500 hover:bg-rose-400 text-white py-3 disabled:opacity-50"
        >
          결제하기
        </button>
      </div>
    </aside>
  );
}
