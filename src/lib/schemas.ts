import { z } from "zod";

export const PostSchema = z.object({
  title: z.string().min(1, "Tytuł jest wymagany"),
  content: z.string().min(1, "Treść jest wymagana"),
});

export type PostInput = z.infer<typeof PostSchema>;
