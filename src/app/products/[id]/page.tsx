import type { Product } from "@/types/product";
import { getBaseUrl } from "@/lib/env";

async function getProduct(id: string): Promise<Product> {
  const fallback: Product = {
    id,
    name: "올리브 샴푸",
    brand: "알맹",
    composition: "정제수, 올리브오일, 계면활성제...",
    ecoInfo: "재활용 용기, 생분해 성분 사용",
  };
  try {
    const res = await fetch(`${getBaseUrl()}/api/products/${id}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return res.json();
  } catch {
    return fallback;
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
        {product.brand ? <p className="text-sm text-slate-500">브랜드: {product.brand}</p> : null}
      </header>

      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        {product.composition ? (
          <div>
            <p className="text-sm font-semibold text-slate-900">성분</p>
            <p className="mt-1 text-sm text-slate-600">{product.composition}</p>
          </div>
        ) : null}

        {product.ecoInfo ? (
          <div>
            <p className="text-sm font-semibold text-slate-900">친환경 정보</p>
            <p className="mt-1 text-sm text-slate-600">{product.ecoInfo}</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
