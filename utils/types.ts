export interface IUser {
  user_id?: any;
  first_name: string;
  surname: string;
  email: string;
  user_password: string;
  phone?: string;
  avatar?: string;
  avatar_public_id?: string;
  avatar_url?: string;
  user_role?: string;
  dept_id?: string;
}

export interface IJob {
  job_title?: any;
  job_type?: string;
  job_description?: string;
  priority?: string;
  estimated_time?: string;
  assigned_technician_id?: string;
  scheduled_date?: string;
  job_notes?: string;
}
