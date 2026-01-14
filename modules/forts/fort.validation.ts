import { z } from "zod";

export const createFortSchema = z.object({
  name: z.string().min(2),
  location: z.string().min(2),
  description: z.string().min(10),
  image_url: z.string().url(),
  hints: z.array(z.string().min(1)),
});

export const updateFortSchema = z.object({
  name: z.string().min(2).optional(),
  location: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  image_url: z.string().url().optional(),
  hints: z.array(z.string().min(1)).optional(),
  is_active: z.boolean().optional(), // 🔥 IMPORTANT FIX
});
