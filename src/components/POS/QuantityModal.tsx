"use client";
import { useEffect, useState } from "react";

export type Unit = "g";

export default function QuantityModal({
  open,
  onClose,
  onConfirm,
  unitPrice,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (v: { volume: number; unit: Unit }) => void;
  unitPrice: number;
}) {
  const [vol, setVol] = useState<number>(100);

  useEffect(() => {
    if (open) {
      setVol(100);
    }
  }, [open]);

  if (!open) return null;
  const price = vol * (unitPrice || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40">
      <div className="w-full md:max-w-md rounded-t-2xl md:rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="text-lg font-semibold">용량 입력</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* 용량 */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">용량 (g)</label>
            <div className="flex items-center rounded-lg border">
              <button
                onClick={() => setVol((v) => Math.max(0, v - 50))}
                className="px-3 py-2 text-lg"
                aria-label="감소"
              >
                −
              </button>
              <input
                type="number"
                min={0}
                step={1}
                value={vol}
                onChange={(e) => setVol(Math.max(0, Number(e.target.value) || 0))}
                className="w-full px-3 py-2 outline-none text-right"
              />
              <button
                onClick={() => setVol((v) => v + 50)}
                className="px-3 py-2 text-lg"
                aria-label="증가"
              >
                ＋
              </button>
            </div>
          </div>

          <div className="text-right text-slate-600">
            예상 금액{" "}
            <span className="font-semibold text-slate-900">{price.toLocaleString()}원</span>
          </div>
        </div>

        <div className="px-5 py-3 border-t flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border px-4 py-2">
            취소
          </button>
          <button
            onClick={() => {
              onConfirm({ volume: vol, unit: "g" });
              onClose();
            }}
            disabled={vol <= 0}
            className="rounded-lg bg-rose-500 hover:bg-rose-400 text-white px-4 py-2 disabled:opacity-50"
          >
            담기
          </button>
        </div>
      </div>
    </div>
  );
}
