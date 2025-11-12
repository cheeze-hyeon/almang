// src/app/pos/page.tsx
import { redirect } from "next/navigation";

export default function POSIndex() {
  // ✅ 이제 POS 진입 시, 운영자가 상품을 입력하는 checkout 화면으로 이동
  redirect("/pos/checkout");
  return null;
}
