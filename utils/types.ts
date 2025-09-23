export interface IUser {
  user_id: any;
  first_name: string;
  surname: string;
  email: string;
  user_password: string;
  phone: string;
  avatar: string;
  avatar_public_id: string;
  avatar_url: string;
  user_role: string;
  dept_id: string;
}
export interface IJob {
  job_id: string;
  job_list_id: string | number;
  job_title: string;
  job_type: string;
  job_status: string;
  job_description: string;
  job_location: string;
  priority: string;
  estimated_time: string;
  assigned_technician_id: string;
  scheduled_date: string;
  job_notes: string;
}

export interface IInvoice {
  invoice_id: string;
  invoice_code: string;
  job_list_id: string;
  amount: string;
  invoice_status: string;
  due_date: string;
}
