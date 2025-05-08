import { z } from "zod";

export const LogInSchema = z.object({
    email : z.string().min(1,"").email("Invalid Email"),
    password : z.string().min(6,"Password must be at least 6 characters long. ")
    .regex(/(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,}/,"Contain at least one digit, and one special character (!@#$%^&*)"),
})
export type LoginState = z.infer<typeof LogInSchema>;