import { z } from "zod";

export const PaymentSchema = z.object({
    eventId: z.string().min(1, "Event is required"),
    amount: z
        .preprocess((value) => {
            const numberValue = parseFloat(value as string);
            return isNaN(numberValue) ? 0 : numberValue; // Return 0 if it's not a valid number
        }, z.number().min(1, "Amount is required")),
    message: z.string().nullable()
});
export type PaymentState = z.infer<typeof PaymentSchema>;
