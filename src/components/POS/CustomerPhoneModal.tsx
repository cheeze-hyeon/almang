"use client";
import { useState, useEffect, useMemo } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (phone: string) => void;
  loading?: boolean;
  initialPhone?: string;
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

export default function CustomerPhoneModal({
  open,
  onClose,
  onSave,
  loading = false,
  initialPhone,
}: Props) {
  const [phone, setPhone] = useState(initialPhone || "010");

  useEffect(() => {
    if (open) {
      setPhone(initialPhone || "010");
    }
  }, [open, initialPhone]);

  const display = useMemo(() => formatPhone(phone), [phone]);
  const digits = normalize(phone).length;
  const canSave = digits >= 10 && !loading;

  const push = (d: string) => {
    if (loading) return;
    const normalized = normalize(phone + d);
    setPhone(normalized);
  };

  const back = () => {
    if (loading) return;
    const normalized = normalize(phone);
    if (normalized.length <= 3) return; // 010은 유지
    setPhone(normalized.slice(0, -1));
  };

  const handleSave = () => {
    if (canSave) {
      onSave(phone);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[800px] min-h-[491px] rounded-[34px] bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 배경 SVG (원래 디자인 유지) */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 700 491"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-0 top-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 16C0 7.16345 7.16344 0 16 0H684C692.837 0 700 7.16344 700 16V491H16C7.16343 491 0 483.837 0 475V16Z"
            fill="white"
          />
        </svg>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          aria-label="닫기"
        >
          <svg
            width="39"
            height="39"
            viewBox="0 0 39 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M29.25 9.75L9.75 29.25"
              stroke="#222222"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.75 9.75L29.25 29.25"
              stroke="#222222"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 컨텐츠 영역 */}
        <div className="relative w-full h-full p-6 md:p-8 lg:p-12 flex flex-col md:flex-row min-h-[491px]">
          {/* 왼쪽: 제목 + 입력 필드 */}
          <div className="flex-1 flex flex-col justify-start">
            {/* 제목 */}
            <p className="text-xl font-semibold text-left text-neutral-700 mb-6 md:mb-8">
              고객 전화번호 입력
            </p>

            {/* 전화번호 입력 필드 */}
            <div className="relative w-full max-w-[327px]">
              <div className="flex items-center w-full h-12 md:h-14 px-4 py-2.5 rounded-[11px] bg-white border-2 border-[#e75251]">
                <div className="flex-1 flex items-center relative">
                  <span className="text-lg md:text-xl font-medium text-black/60 mr-2">|</span>
                  <span className="text-lg md:text-xl font-medium text-black">
                    {display || "010"}
                  </span>
                </div>
                <svg
                  width="27"
                  height="27"
                  viewBox="0 0 27 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0 ml-2"
                  preserveAspectRatio="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.625 12.375C5.625 8.65238 8.65238 5.625 12.375 5.625C16.0976 5.625 19.125 8.65238 19.125 12.375C19.125 16.0976 16.0976 19.125 12.375 19.125C8.65238 19.125 5.625 16.0976 5.625 12.375ZM23.2954 21.7046L19.476 17.8841C20.6606 16.3609 21.375 14.4517 21.375 12.375C21.375 7.41263 17.3374 3.375 12.375 3.375C7.41263 3.375 3.375 7.41263 3.375 12.375C3.375 17.3374 7.41263 21.375 12.375 21.375C14.4517 21.375 16.3609 20.6606 17.8841 19.476L21.7046 23.2954C21.924 23.5148 22.212 23.625 22.5 23.625C22.788 23.625 23.076 23.5148 23.2954 23.2954C23.7353 22.8555 23.7353 22.1445 23.2954 21.7046Z"
                    fill="black"
                  />
                  <mask
                    id="mask0_95_7503"
                    style={{ maskType: "luminance" }}
                    maskUnits="userSpaceOnUse"
                    x="3"
                    y="3"
                    width="21"
                    height="21"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.625 12.375C5.625 8.65238 8.65238 5.625 12.375 5.625C16.0976 5.625 19.125 8.65238 19.125 12.375C19.125 16.0976 16.0976 19.125 12.375 19.125C8.65238 19.125 5.625 16.0976 5.625 12.375ZM23.2954 21.7046L19.476 17.8841C20.6606 16.3609 21.375 14.4517 21.375 12.375C21.375 7.41263 17.3374 3.375 12.375 3.375C7.41263 3.375 3.375 7.41263 3.375 12.375C3.375 17.3374 7.41263 21.375 12.375 21.375C14.4517 21.375 16.3609 20.6606 17.8841 19.476L21.7046 23.2954C21.924 23.5148 22.212 23.625 22.5 23.625C22.788 23.625 23.076 23.5148 23.2954 23.2954C23.7353 22.8555 23.7353 22.1445 23.2954 21.7046Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask0_95_7503)">
                    <rect width="27" height="27" fill="#E75251" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* 오른쪽 절반: 키패드 + 저장하기 버튼 (가운데 정렬) */}
          <div className="flex-1 flex items-center justify-center md:justify-end md:pr-1 lg:pr-2">
            <div className="relative w-full flex flex-col gap-4 md:gap-6">
              {/* 키패드 그리드 */}
              <div className="grid grid-cols-3 gap-x-12 md:gap-x-16 gap-y-3 md:gap-y-5 w-full">
                {/* 1-9 숫자 */}
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => push(num)}
                    disabled={loading}
                    className="w-full h-12 md:h-14 bg-white text-2xl md:text-3xl lg:text-4xl font-medium text-[#333] hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
                  >
                    {num}
                  </button>
                ))}

                {/* 삭제 버튼 */}
                <button
                  type="button"
                  onClick={back}
                  disabled={loading}
                  className="w-full h-12 md:h-14 bg-white flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50"
                  aria-label="삭제"
                >
                  <svg
                    width="33"
                    height="30"
                    viewBox="0 0 33 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 md:w-8 md:h-8"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0.585785 13.3137C-0.195263 14.0947 -0.195263 15.3611 0.585785 16.1421L13.3137 28.87C14.0948 29.6511 15.3611 29.6511 16.1421 28.87C16.9232 28.089 16.9232 26.8227 16.1421 26.0416L4.82843 14.7279L16.1421 3.4142C16.9232 2.63315 16.9232 1.36682 16.1421 0.58577C15.3611 -0.195279 14.0948 -0.195279 13.3137 0.58577L0.585785 13.3137ZM33 14.7279V12.7279L2 12.7279V14.7279V16.7279L33 16.7279V14.7279Z"
                      fill="#333333"
                    />
                  </svg>
                </button>

                {/* 0 */}
                <button
                  type="button"
                  onClick={() => push("0")}
                  disabled={loading}
                  className="w-full h-12 md:h-14 bg-white text-2xl md:text-3xl lg:text-4xl font-medium text-[#333] hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  0
                </button>

                {/* 빈 공간 (키패드 레이아웃 유지) */}
                <div className="w-full h-12 md:h-14"></div>
              </div>

              {/* 저장하기 버튼 (키패드 너비만큼) */}
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className="flex justify-center items-center w-full gap-2 p-3.5 rounded-lg bg-[#e75251] text-white hover:bg-[#d43f3e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: "0px 8px 24px 0 rgba(234,124,105,0.3)" }}
              >
                <p className="text-base font-bold text-center text-neutral-50">
                  {loading ? "저장 중..." : "저장하기"}
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
