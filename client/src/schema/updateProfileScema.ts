import { z } from "zod";

export const UpdateSchema = z.object({
  username: z.string().min(1, "Username can't be empty"),
  address: z.string().min(1, "Address is required"),
  mobile_no: z
    .string()
    .regex(/^\d{10}$/, "Invalid mobile number, must be 10 digits"),
  aadhar_no: z
    .string()
    .regex(/^\d{12}$/, "Invalid Aadhar number, must be 12 digits"),
  pan_no: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format. Must be in Capital Letters"),
});
export type UpdateState = z.infer<typeof UpdateSchema>;
