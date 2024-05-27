import z from "zod";

export const Balance = z.preprocess(
  (value: any) => ({
    userId: value?.user_id,
    createdAt: value?.created_at,
    ...value,
  }),
  z.object({
    id: z.string(),
    userId: z.string(),
    value: z.number(),
    createdAt: z.date(),
  })
);

export type Balance = z.infer<typeof Balance>;
