export type ProductCategory =
  | "shampoo" // 샴푸
  | "body_handwash" // 바디워시/핸드워시
  | "lotion_oil" // 로션/오일
  | "cream_balm_gel_pack" // 크림/밤/젤/팩
  | "cleansing" // 클렌징 제품
  | "detergent"; // 세제

export type Product = {
  id: string;
  name: string;
  brand?: string;
  category?: ProductCategory;
  stockM1: number;
  unitPricePerMl: number;
  status: string;
};
