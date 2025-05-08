import { z } from 'zod';

const ChangePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(6, "Current password must be at least 6 characters")
        .regex(/(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,}/, "Contain at least one digit, and one special character (!@#$%^&*)"),
    newPassword: z
        .string()
        .min(6, "New password must be at least 6 characters")
        .regex(/(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,}/, "Should contain at least one digit, and one special character (!@#$%^&*)"),

    confirmNewPassword: z
        .string()
        .min(1, "Confirm password cannot be empty. ")

})
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Passwords do not match",
        path: ["confirmNewPassword"],
    })

export type ChangePasswordState = z.infer<typeof ChangePasswordSchema>;

export default ChangePasswordSchema