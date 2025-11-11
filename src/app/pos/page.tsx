// src/app/pos/page.tsx
import { redirect } from "next/navigation";

export default function POSIndex() {
  redirect("/pos/customer"); // ✅ POS 진입 시 항상 고객 조회/가입 화면으로
  return null;
}
