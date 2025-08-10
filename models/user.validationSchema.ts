import { z } from "zod";

const passwordPattern: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const roles = ["system_admin", "operations_manager", "admin"] as const;

export const UserRegistrationSchema = z.object({
  first_name: z.string(),
  surname: z.string(),
  email: z.string().email(),
  user_password: z
    .string()
    .min(8, { message: "Password should have a minimun of 5 characters" })
    .max(24, { message: "Password should have a maximum of 20 characters" })
    .regex(passwordPattern, {
      message:
        "The password must be 8 to 24 characters long with at least one uppercase letter, on lower case letter, one special character i.e [!@#$%] and one number",
    }),
  phone: z.string(),
  avatar: z.string().optional(),
  user_role: z.enum(roles).optional(),
});

export const UserActivationSchema = z.object({
  activation_token: z.string(),
  activation_code: z.string(),
});

export const UserLoginSchema = z.object({
  email: z.string().email(),
  user_password: z.string(),
});

export const UserPasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, { message: "Password should have a minimun of 5 characters" })
      .max(24, { message: "Password should have a maximum of 20 characters" })
      .regex(passwordPattern, {
        message:
          "The password must be 8 to 24 characters long with at least one uppercase letter, on lower case letter, one special character i.e [!@#$%] and one number",
      }),
    newPassword: z
      .string()
      .min(8, { message: "Password should have a minimun of 5 characters" })
      .max(24, { message: "Password should have a maximum of 20 characters" })
      .regex(passwordPattern, {
        message:
          "The password must be 8 to 24 characters long with at least one uppercase letter, on lower case letter, one special character i.e [!@#$%] and one number",
      }),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "Old Password and New passwords cannot be the same",
    path: ["newPassword"],
  });

export const UserRoleSchema = z.object({
  email: z.string().email(),
  role: z.enum(roles),
});
