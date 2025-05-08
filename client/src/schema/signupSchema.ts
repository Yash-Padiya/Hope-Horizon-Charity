import { z } from "zod";

export const SignUpSchema = z.object({
  username: z.string().min(1, "Username can't be empty"),
  email: z.string().min(1, "").email("Invalid Email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long. ")
    .regex(
      /(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z])/,
      "Contain at least one digit, and one special character (!@#$%^&*)"
    ),
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
export type RegistrationState = z.infer<typeof SignUpSchema>;
