import { z } from "zod";

const passwordPattern: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const priority = ["high", "low", "medium", "critical"] as const;
const status = ["pending", "assigned", "in_progress", "completed"] as const;

export const JobSchema = z.object({
  job_title: z.string(),
  job_type: z.string(),
  job_status: z.enum(status),
  job_description: z.string(),
  job_location: z.string(),
  priority: z.enum(priority),
  estimated_time: z.string(),
  assigned_technician_id: z.string(),
  scheduled_date: z.string(),
  job_notes: z.string(),
});
