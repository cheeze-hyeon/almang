"use client";

import { useState, useEffect } from "react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  totalSpent: number;
  refillCount: number;
  co2SavedKg: number;
  grade: string;
}

interface Product {
  id: string;
  name: string;
  stockMl: number;
  unitPricePerMl: number;
  status: string;
}

interface CartItem {
  productId: string;
  name: string;
  volumeMl: number;
  unitPricePerMl: number;
  amount: number;
}

export default function POSPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 상품 목록 로드
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/pos/products");
        if (response.ok) {
          const data = await response.json();
          setAvailableProducts(data);
        }
      } catch (err) {
        console.error("상품 목록 로드 실패:", err);
      }
    };
    fetchProducts();
  }, []);

  // 총 금액 계산
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.amount, 0);
    setTotalAmount(total);
  }, [cartItems]);

  // 고객 조회
  const handleSearch = async () => {
    if (!phoneNumber.trim()) {
      setError("전화번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/pos/customers?phone=${encodeURIComponent(phoneNumber)}`);
      if (response.ok) {
        const data = await response.json();
        setCustomer(data);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "고객을 찾을 수 없습니다.");
        setCustomer(null);
      }
    } catch (err) {
      setError("고객 조회 중 오류가 발생했습니다.");
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  // 상품 추가
  const handleAddProduct = () => {
    if (availableProducts.length === 0) {
      setError("등록된 상품이 없습니다.");
      return;
    }

    // 첫 번째 상품을 기본으로 추가 (실제로는 상품 선택 모달 필요)
    const product = availableProducts[0];
    const volumeMl = 100; // 기본값, 실제로는 입력받아야 함

    const newItem: CartItem = {
      productId: product.id,
      name: product.name,
      volumeMl,
      unitPricePerMl: product.unitPricePerMl,
      amount: volumeMl * product.unitPricePerMl,
    };

    setCartItems([...cartItems, newItem]);
    setError(null);
  };

  // 신규 고객 등록
  const handleRegisterCustomer = async () => {
    const name = prompt("고객 이름을 입력해주세요:");
    if (!name) return;

    const phone = phoneNumber.trim() || prompt("전화번호를 입력해주세요:");
    if (!phone) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/pos/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
      });

      if (response.ok) {
        const data = await response.json();
        setCustomer(data);
        setPhoneNumber(data.phone);
        setError(null);
        alert("고객이 등록되었습니다.");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "고객 등록에 실패했습니다.");
      }
    } catch (err) {
      setError("고객 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 결제 완료
  const handlePayment = async () => {
    if (!customer) {
      setError("고객 정보가 필요합니다.");
      return;
    }

    if (cartItems.length === 0) {
      setError("상품을 추가해주세요.");
      return;
    }

    if (!confirm("결제를 완료하시겠습니까?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/pos/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customer.id,
          items: cartItems,
          totalAmount,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`결제가 완료되었습니다!\n영수증 ID: ${data.receipt.id}`);
        // 초기화
        setCartItems([]);
        setCustomer(null);
        setPhoneNumber("");
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "결제 처리에 실패했습니다.");
      }
    } catch (err) {
      setError("결제 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-6xl">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="mb-2 rounded-lg bg-purple-600 px-6 py-3 text-white">
            <h1 className="text-lg font-semibold">와이어프레임/목업 - 관리자 POS</h1>
          </div>
          <div className="text-green-600">
            <h2 className="text-2xl font-bold">제로웨이스트샵 POS</h2>
            <p className="text-lg">리필 상품 판매 시스템</p>
          </div>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="grid grid-cols-2 gap-6">
          {/* 왼쪽: 고객 조회 */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">고객 조회</h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="010-1234-5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <svg
                    className="h-4 w-4"
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
                  조회
                </button>
              </div>

              {customer && (
                <div className="rounded-md bg-green-50 p-3">
                  <p className="font-semibold text-green-900">{customer.name}</p>
                  <p className="text-sm text-green-700">등급: {customer.grade}</p>
                  <p className="text-sm text-green-700">리필 횟수: {customer.refillCount}회</p>
                </div>
              )}

              {error && (
                <div className="rounded-md bg-red-50 p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="text-center text-gray-500">또는</div>

              <button
                onClick={handleRegisterCustomer}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                신규 고객 등록
              </button>
            </div>
          </div>

          {/* 오른쪽: 상품 선택 */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">상품 선택</h3>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleAddProduct}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-3 text-white hover:bg-green-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                상품 추가
              </button>

              {cartItems.length === 0 ? (
                <p className="text-center text-gray-400">상품을 추가해주세요</p>
              ) : (
                <div className="space-y-2">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border border-gray-200 p-3"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.volumeMl}ml × {item.unitPricePerMl.toLocaleString()}원/ml
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{item.amount.toLocaleString()}원</span>
                        <button
                          onClick={() => {
                            setCartItems(cartItems.filter((_, i) => i !== index));
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 하단: 총 결제 금액 */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-green-500 to-blue-500 px-6 py-4 text-white">
            <span className="text-lg font-semibold">총 결제 금액</span>
            <span className="text-2xl font-bold">{totalAmount.toLocaleString()}원</span>
          </div>

          <button
            onClick={handlePayment}
            disabled={totalAmount === 0 || loading || !customer}
            className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-white ${
              totalAmount === 0 || loading || !customer
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            결제 완료
          </button>
        </div>
      </div>
    </main>
  );
}

