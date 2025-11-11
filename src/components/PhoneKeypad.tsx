"use client";
import { useMemo } from "react";

type Props = {
  value: string;
  onChange: (next: string) => void;
  onSubmit?: () => void;
  title?: string;
  ctaLabel?: string;
  loading?: boolean;
  prefix?: string;
  className?: string; // ⬅️ (선택) 추가: 바깥 폭/여백 커스텀용
};

function normalize(num: string) {
  return num.replace(/\D/g, "").slice(0, 11);
}
function formatPhone(num: string) {
  const s = normalize(num);
  if (s.startsWith("02")) {
    if (s.length > 9) return `${s.slice(0, 2)}-${s.slice(2, 6)}-${s.slice(6, 10)}`;
    if (s.length > 5) return `${s.slice(0, 2)}-${s.slice(2, 6)}-${s.slice(6)}`;
    if (s.length > 2) return `${s.slice(0, 2)}-${s.slice(2)}`;
    return s;
  }
  if (s.length > 7) return `${s.slice(0, 3)}-${s.slice(3, 7)}-${s.slice(7, 11)}`;
  if (s.length > 3) return `${s.slice(0, 3)}-${s.slice(3)}`;
  return s;
}

export default function PhoneKeypad({
  value,
  onChange,
  onSubmit,
  title = "휴대폰 번호를 입력해 주세요.",
  ctaLabel = "확인",
  loading,
  prefix,
  className,
}: Props) {
  const ensureWithPrefix = (raw: string) => {
    const n = normalize(raw);
    if (!prefix) return n;
    const p = normalize(prefix);
    if (n.startsWith(p)) return n;
    return (p + n).slice(0, 11);
  };

  const display = useMemo(() => formatPhone(ensureWithPrefix(value)), [value, prefix]);
  const digits = normalize(ensureWithPrefix(value)).length;
  const disabled = digits < 10 || loading;

  const push = (d: string) => {
    if (loading) return;
    onChange(ensureWithPrefix(value + d));
  };
  const back = () => {
    if (loading) return;
    const p = normalize(prefix ?? "");
    const cur = normalize(value);
    if (p && cur.length <= p.length) return;
    onChange(cur.slice(0, -1));
  };
  const clear = () => {
    if (loading) return;
    const p = normalize(prefix ?? "");
    onChange(p);
  };

  return (
    <div
      className={[
        // ⬇️ 폭을 크게: 모바일 max-w-xl, md에서 2xl, lg에서 3xl
        "mx-auto w-full max-w-xl md:max-w-2xl lg:max-w-3xl",
        className || "",
      ]
        .join(" ")
        .trim()}
    >
      {/* 상단 바: 패딩/폰트 크기를 반응형으로 확장 */}
      <div className="rounded-t-2xl bg-slate-900 px-4 py-3 md:px-6 md:py-4 text-white">
        <div className="text-[15px] md:text-base lg:text-lg">{title}</div>
      </div>

      {/* 본 카드: 패딩/그림자/라인 유지 */}
      <div className="rounded-b-2xl bg-white p-3 md:p-5 lg:p-6 shadow-xl ring-1 ring-black/5 overflow-hidden">
        {/* 표시창: 높이/폰트 크게 */}
        <div className="mb-3 md:mb-4 flex h-12 md:h-14 lg:h-16 items-center justify-end rounded-lg border border-slate-200 bg-slate-50 px-3 md:px-4 text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide tabular-nums">
          {display || (prefix ? formatPhone(prefix) : "010-")}
        </div>

        {/* 3x4 키패드: 버튼 사이 간격/폰트/터치 타겟 확대 */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 lg:gap-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => push(n)}
              className="aspect-square rounded-xl border border-slate-200 text-2xl md:text-3xl lg:text-4xl font-semibold active:scale-[0.98] transition"
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={back}
            className="aspect-square rounded-xl border border-slate-200 text-xl md:text-2xl lg:text-3xl font-semibold active:scale-[0.98] transition"
            aria-label="지우기"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => push("0")}
            className="aspect-square rounded-xl border border-slate-200 text-2xl md:text-3xl lg:text-4xl font-semibold active:scale-[0.98] transition"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => !disabled && onSubmit?.()}
            disabled={disabled}
            className={[
              "aspect-square rounded-xl text-base md:text-lg lg:text-xl font-semibold transition",
              disabled
                ? "bg-slate-200 text-slate-500"
                : "bg-orange-500 text-white hover:bg-orange-600 active:scale-[0.98]",
            ].join(" ")}
          >
            {loading ? "..." : ctaLabel}
          </button>
        </div>

        {/* 하단 도우미: 여백/폰트도 키움 */}
        <div className="mt-3 md:mt-4 flex justify-between text-xs md:text-sm text-slate-500">
          <button onClick={clear} type="button" className="underline">
            전체 지우기
          </button>
          <span>10~11자리 입력</span>
        </div>
      </div>
    </div>
  );
}
