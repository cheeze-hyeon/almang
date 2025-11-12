export interface CustomerLoyalty {
  id: number;
  customer_id: number | null;
  level: string | null;
  grade: string | null;
  accumulated_purchase_amount: number | null;
  accumulated_carbon_reduction_kg: number | null;
  total_refill_count: number | null;
}

