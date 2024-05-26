import z from "zod";

export const Balance = z.object({
  id: z.string(),
  userId: z.string(),
  value: z.number(),
  createdAt: z.preprocess(
    (value) => typeof value === "string" && new Date(value),
    z.date()
  ),
});

export type Balance = z.infer<typeof Balance>;
