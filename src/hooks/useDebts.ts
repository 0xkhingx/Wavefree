import { useState, useEffect, useCallback } from "react";
import type { Debt } from "@/types";
import { getDebts } from "@/services/supabase";

const MOCK_USER_ID = "mock-user-123";

const FALLBACK_DEBTS: Debt[] = [
  { id: "1", userId: MOCK_USER_ID, name: "Chase Credit Card", totalAmount: 4500, amountOwed: 3200, urgency: "high", arrangementType: "standard", minimumPayment: 95, dueDate: "2026-07-15", notes: "", createdAt: "2026-01-10T00:00:00Z", updatedAt: "2026-06-20T00:00:00Z" },
  { id: "2", userId: MOCK_USER_ID, name: "Sallie Mae Student Loan", totalAmount: 24000, amountOwed: 24000, urgency: "low", arrangementType: "payment_plan", minimumPayment: 240, dueDate: "2026-08-01", notes: "", createdAt: "2023-09-01T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z" },
  { id: "3", userId: MOCK_USER_ID, name: "Amex Platinum", totalAmount: 8000, amountOwed: 2100, urgency: "critical", arrangementType: "standard", minimumPayment: 60, dueDate: "2026-06-28", notes: "", createdAt: "2026-03-15T00:00:00Z", updatedAt: "2026-06-25T00:00:00Z" },
  { id: "4", userId: MOCK_USER_ID, name: "Personal Loan - Marcus", totalAmount: 15000, amountOwed: 9200, urgency: "medium", arrangementType: "payment_plan", minimumPayment: 310, dueDate: "2026-07-22", notes: "", createdAt: "2025-11-01T00:00:00Z", updatedAt: "2026-06-15T00:00:00Z" },
  { id: "5", userId: MOCK_USER_ID, name: "Discover Card", totalAmount: 3200, amountOwed: 3200, urgency: "high", arrangementType: "standard", minimumPayment: 75, dueDate: "2026-07-05", notes: "", createdAt: "2026-04-01T00:00:00Z", updatedAt: "2026-06-20T00:00:00Z" },
  { id: "6", userId: MOCK_USER_ID, name: "Car Loan - Toyota", totalAmount: 18000, amountOwed: 15000, urgency: "medium", arrangementType: "payment_plan", minimumPayment: 375, dueDate: "2026-07-10", notes: "", createdAt: "2025-03-01T00:00:00Z", updatedAt: "2026-06-01T00:00:00Z" },
];

const SUPABASE_CONFIGURED = !!(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

export function useDebts() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDebts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!SUPABASE_CONFIGURED) {
        setDebts(FALLBACK_DEBTS);
        setLoading(false);
        return;
      }
      const data = await getDebts(MOCK_USER_ID);
      setDebts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch debts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  return { debts, loading, error, refetch: fetchDebts };
}
