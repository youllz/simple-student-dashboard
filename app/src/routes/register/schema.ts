import { z } from "zod";
export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  passwordConfirm: z.string().min(8)

});
export type ResgisterSchema = typeof registerSchema;