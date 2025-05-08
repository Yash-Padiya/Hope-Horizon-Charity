import { z } from "zod";

const feedbackSchema = z.object({
    eventId : z.string().min(1, 'Event Id is required'),
  ratings: z.number().min(1, 'Ratings must be at least 1').max(5, 'Ratings must be at most 5'),
  description: z.string().min(10, 'Description must be at least 10 characters long')
});
export type FeedbackState = z.infer<typeof feedbackSchema>;
export default feedbackSchema