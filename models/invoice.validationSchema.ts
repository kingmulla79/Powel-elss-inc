import { z } from "zod";

const passwordPattern: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const status = ["paid", "unpaid"] as const;

export const InvoiceGenerationSchema = z.object({
  job_list_id: z.string(),
  amount: z.string(),
  invoice_status: z.enum(status),
  due_date: z.string(),
});
