import { z } from "zod";

const status = ["paid", "unpaid"] as const;

export const InvoiceGenerationSchema = z.object({
  job_list_id: z.string(),
  amount: z.string(),
  invoice_status: z.enum(status),
  due_date: z.string(),
});
