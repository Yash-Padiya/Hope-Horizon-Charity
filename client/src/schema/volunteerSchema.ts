import { z } from "zod";

export const VolunteerSchema = z.object({
  name: z.string().min(1, "Volunteer name can't be empty"),
  email: z.string().min(1, "").email("Invalid Email"),
  address: z.string().min(1, "Address is required"),
  mobile_no: z
    .string()
    .regex(/^\d{10}$/, "Invalid mobile number, must be 10 digits"),
  aadhar_no: z
    .string()
    .regex(/^\d{12}$/, "Invalid Aadhar number, must be 12 digits"),

});
export type VolunteerState = z.infer<typeof VolunteerSchema>;
