import type { Debt, Allocation, AllocationResult, UrgencyLevel } from "@/types";

const CLAUDE_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY ?? "";

const URGENCY_WEIGHT: Record<UrgencyLevel, number> = {
  critical: 10,
  high: 7,
  medium: 4,
  low: 1,
};

export async function allocateIncome(
  income: number,
  buffer: number,
  debts: Debt[]
): Promise<AllocationResult> {
  if (!CLAUDE_API_KEY) {
    return localAllocate(income, buffer, debts);
  }

  const prompt = buildPrompt(income, buffer, debts);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    const content = json.content?.[0]?.text ?? "";
    const parsed = parseClaudeResponse(content);
    return buildResult(income, buffer, debts, parsed);
  } catch (e) {
    console.warn("Claude API call failed, falling back to local allocation:", e);
    return localAllocate(income, buffer, debts);
  }
}

function buildPrompt(income: number, buffer: number, debts: Debt[]): string {
  const remaining = income - buffer;

  const debtsDetail = debts
    .map(
      (d, i) =>
        `${i + 1}. "${d.name}" — Owed: $${d.amountOwed.toLocaleString()}, ` +
        `Total: $${d.totalAmount.toLocaleString()}, ` +
        `Urgency: ${d.urgency.toUpperCase()}, ` +
        `Min Payment: $${d.minimumPayment.toLocaleString()}/mo, ` +
        `Due: ${d.dueDate || "N/A"}, ` +
        `Arrangement: ${d.arrangementType}`
    )
    .join("\n");

  return `You are a financial allocation assistant. I have $${income.toLocaleString()} in income. I want to keep $${buffer.toLocaleString()} as a personal buffer. The remaining $${remaining.toLocaleString()} should be allocated across my debts.

Here are my debts:
${debtsDetail}

Rules:
- Each debt MUST receive at least its minimum payment.
- Prioritize debts with urgency "critical" > "high" > "medium" > "low".
- Among same-urgency debts, prioritize those closest to their due date.
- If the remaining amount exceeds all minimum payments, allocate the surplus to the highest-urgency debts first, then by nearest due date.

Return ONLY a JSON array (no markdown, no explanation) in this exact format:
[
  {
    "debtId": "<id>",
    "debtName": "<name>",
    "amount": <number>,
    "reasoning": "<short explanation>"
  }
]

Allocate the full $${remaining.toLocaleString()} across the debts following the rules above.`;
}

function parseClaudeResponse(text: string): ClaudeAllocation[] {
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*$/g, "").trim();
  const parsed = JSON.parse(cleaned);
  return parsed as ClaudeAllocation[];
}

type ClaudeAllocation = {
  debtId: string;
  debtName: string;
  amount: number;
  reasoning: string;
};

function buildResult(
  income: number,
  buffer: number,
  debts: Debt[],
  allocations: ClaudeAllocation[]
): AllocationResult {
  const minTotal = debts.reduce((s, d) => s + d.minimumPayment, 0);
  const totalAllocated = allocations.reduce((s, a) => s + a.amount, 0);
  const remaining = income - buffer - totalAllocated;

  const mapped: Allocation[] = allocations.map((a) => ({
    debtId: a.debtId,
    debtName: a.debtName,
    amount: a.amount,
    type: "extra" as const,
  }));

  return {
    totalIncome: income,
    totalExpenses: 0,
    totalMinimumPayments: minTotal,
    remainingAfterMinimums: income - buffer - minTotal,
    allocations: mapped,
    personalSpending: buffer,
    savings: Math.max(0, remaining),
  };
}

function localAllocate(income: number, buffer: number, debts: Debt[]): AllocationResult {
  const remaining = Math.max(0, income - buffer);
  const minTotal = debts.reduce((s, d) => s + d.minimumPayment, 0);

  const sorted = [...debts].sort((a, b) => {
    const urgencyDiff = URGENCY_WEIGHT[b.urgency] - URGENCY_WEIGHT[a.urgency];
    if (urgencyDiff !== 0) return urgencyDiff;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  let pool = remaining;
  const allocations: ClaudeAllocation[] = [];

  for (const debt of sorted) {
    const min = Math.min(debt.minimumPayment, pool);
    if (min <= 0) continue;
    allocations.push({
      debtId: debt.id,
      debtName: debt.name,
      amount: min,
      reasoning: `Minimum payment for ${debt.name} (${debt.urgency} urgency)`,
    });
    pool -= min;
  }

  let surplusIdx = 0;
  while (pool > 0 && surplusIdx < sorted.length) {
    const debt = sorted[surplusIdx];
    const existing = allocations.find((a) => a.debtId === debt.id);
    const extra = Math.min(pool, debt.amountOwed - (existing?.amount ?? 0));
    if (extra > 0) {
      if (existing) {
        existing.amount += extra;
        existing.reasoning += `. Extra $${extra.toLocaleString()} allocated as highest priority debt.`;
      } else {
        allocations.push({
          debtId: debt.id,
          debtName: debt.name,
          amount: extra,
          reasoning: `Surplus allocation to ${debt.name} (${debt.urgency} urgency)`,
        });
      }
      pool -= extra;
    }
    surplusIdx++;
  }

  return buildResult(income, buffer, debts, allocations);
}
