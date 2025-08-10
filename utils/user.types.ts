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
}
export interface IActivationToken {
  token: string;
  activationCode: string;
}
export interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}
