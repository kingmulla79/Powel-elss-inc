import { z } from "zod";

const passwordPattern: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const roles = ["system_admin", "operations_manager", "admin"] as const;

export const JobCreationSchema = z.object({
  job_title: z.string(),
  job_type: z.string(),
  job_status: z.string(),
  job_description: z.string(),
  job_location: z.string(),
  priority: z.string(),
  estimated_time: z.string(),
  assigned_technician_id: z.string(),
  scheduled_date: z.string(),
  job_notes: z.string(),
});
