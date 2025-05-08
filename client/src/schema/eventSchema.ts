import { z } from "zod";

export const eventSchema = z.object({
  Event_name: z.string().min(1, "Event name is required"),
  description: z.string().min(1, "Description is required"),
  Target_fund: z.number().min(1, "Target fund cannot be 0"),
  coverPhoto: z
    .string()
    .min(1, "Cover photo is required.")
    .regex(/^data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+$/, {
      message: " The file must be a valid image.",
    }),
});

export type EventState = z.infer<typeof eventSchema>;
