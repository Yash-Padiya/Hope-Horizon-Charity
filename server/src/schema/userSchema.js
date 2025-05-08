// /schemas/userSchema.js
const { z } = require("zod");

const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  user_type: z.enum(["donor", "admin"], { message: "User type must be 'donor' or 'admin'" }).default("donor"),
  address: z.string().min(1, "Address is required"),
  mobile_no: z.string().regex(/^\d{10}$/, "Invalid mobile number, must be 10 digits"),
  aadhar_no: z.string().regex(/^\d{12}$/, "Invalid Aadhar number, must be 12 digits"),
  pan_no: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format") 
});

module.exports = userSchema;
