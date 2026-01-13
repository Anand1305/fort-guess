import { z } from "zod";

export const createFortSchema = z.object({
  name: z.string().min(3),
  location: z.string().min(3),
  description: z.string().min(10),
  image_url: z.string().url(),
  hints: z.array(z.string().min(3)).max(10),
});

export const updateFortSchema = createFortSchema.partial();
