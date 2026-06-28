import { createClient } from "@supabase/supabase-js";
import type { Debt } from "@/types";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

export async function getDebts(userId: string): Promise<Debt[]> {
  const { data, error } = await supabase
    .from("debts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return mapDebts(data ?? []);
}

type NewDebt = Omit<Debt, "id" | "createdAt" | "updatedAt">;

export async function addDebt(debt: NewDebt): Promise<Debt> {
  const { data, error } = await supabase
    .from("debts")
    .insert({
      user_id: debt.userId,
      name: debt.name,
      total_amount: debt.totalAmount,
      amount_owed: debt.amountOwed,
      urgency: debt.urgency,
      arrangement_type: debt.arrangementType,
      minimum_payment: debt.minimumPayment,
      due_date: debt.dueDate || null,
      notes: debt.notes || null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapDebt(data);
}

export async function updateDebt(id: string, updates: Partial<Debt>): Promise<Debt> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.totalAmount !== undefined) dbUpdates.total_amount = updates.totalAmount;
  if (updates.amountOwed !== undefined) dbUpdates.amount_owed = updates.amountOwed;
  if (updates.urgency !== undefined) dbUpdates.urgency = updates.urgency;
  if (updates.arrangementType !== undefined) dbUpdates.arrangement_type = updates.arrangementType;
  if (updates.minimumPayment !== undefined) dbUpdates.minimum_payment = updates.minimumPayment;
  if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
  dbUpdates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("debts")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapDebt(data);
}

export async function deleteDebt(id: string): Promise<void> {
  const { error } = await supabase.from("debts").delete().eq("id", id);
  if (error) throw error;
}

type DbDebt = {
  id: string;
  user_id: string;
  name: string;
  total_amount: number;
  amount_owed: number;
  urgency: string;
  arrangement_type: string;
  minimum_payment: number;
  due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

function mapDebt(d: DbDebt): Debt {
  return {
    id: d.id,
    userId: d.user_id,
    name: d.name,
    totalAmount: d.total_amount,
    amountOwed: d.amount_owed,
    urgency: d.urgency as Debt["urgency"],
    arrangementType: d.arrangement_type as Debt["arrangementType"],
    minimumPayment: d.minimum_payment,
    dueDate: d.due_date ?? "",
    notes: d.notes ?? undefined,
    createdAt: d.created_at,
    updatedAt: d.updated_at,
  };
}

function mapDebts(data: DbDebt[]): Debt[] {
  return data.map(mapDebt);
}
