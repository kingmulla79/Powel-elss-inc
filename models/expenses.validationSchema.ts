import { z } from "zod";

const category = [
  "transportation",
  "equipment",
  "materials",
  "utilities",
] as const;
const expense_status = ["paid", "approved", "pending", "denied"] as const;

export const ExpenseGenerationSchema = z.object({
  job_list_id: z.string(),
  dept_id: z.string(),
  amount: z.string(),
  expense_description: z.string(),
  category: z.enum(category),
  expense_status: z.enum(expense_status),
});

export const ExpenseUpdateSchema = z.object({
  expense_id: z.string(),
  job_list_id: z.string(),
  dept_id: z.string(),
  amount: z.string(),
  expense_description: z.string(),
  category: z.enum(category),
  expense_status: z.enum(expense_status),
});
