import { z } from "zod";

const supportSchema = z.object({
  query: z.string().min(5, 'Query must be at least 5 characters long').max(300, 'Query must be at most 300 characters long'),
});
export type SupportState = z.infer<typeof supportSchema>;
export default supportSchema