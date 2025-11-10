export type Product = {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  composition?: string; // 성분 요약 텍스트
  ecoInfo?: string; // 친환경 관련 설명
};
