"use client";

export default function Header() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <header className="w-full bg-[#F2F2F7] px-4 md:px-8 py-4 md:py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* 좌측: 로고 + 상점명 + 날짜 */}
        <div className="flex items-center gap-4">
          {/* 로고 */}
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-red-500 via-blue-500 to-white flex items-center justify-center">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white"></div>
            </div>
          </div>

          {/* 상점명 + 날짜 */}
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-black">알맹상점</h1>
            <p className="text-sm md:text-base text-black">{dateStr}</p>
          </div>
        </div>

        {/* 우측: 검색바 */}
        <div className="flex-1 md:flex-initial md:max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="상품 검색"
              className="w-full px-4 py-2.5 md:py-3 pl-10 rounded-lg bg-white border border-gray-200 text-sm md:text-base text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#70bce8] focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}

