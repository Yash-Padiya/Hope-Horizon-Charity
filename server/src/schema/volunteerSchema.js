// /schemas/userSchema.js
const { z } = require("zod");

const volunteerSchema = z.object({
  name: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  joinDate: z.date().optional(),
  leaveDate: z.date().optional(),
  address: z.string().min(1, "Address is required"),
  mobile_no: z.string().regex(/^\d{10}$/, "Invalid mobile number, must be 10 digits"),
  aadhar_no: z.string().regex(/^\d{12}$/, "Invalid Aadhar number, must be 12 digits"),
});

module.exports = volunteerSchema;
