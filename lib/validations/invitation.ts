import { z } from "zod";

export const THEMES = ["cute", "romantic", "funny", "crazy", "simple"] as const;
export const ACTIVITIES = ["coffee", "pizza", "cinema", "sunset", "dinner", "gaming", "beach", "surprise", "custom"] as const;

const clean = (s: string) => s.replace(/[<>]/g, "").trim();

export const createInvitationSchema = z.object({
  senderName: z.string().transform(clean).pipe(z.string().min(1).max(40)),
  recipientName: z.string().transform(clean).pipe(z.string().min(1).max(40)),
  message: z.string().transform(clean).pipe(z.string().min(1).max(140)),
  theme: z.enum(THEMES),
  dateIdea: z.enum(ACTIVITIES),
});

export const slugSchema = z.string().regex(/^[A-Za-z0-9]{7,12}$/);

export const submitDateSchema = z.object({
  slug: slugSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  activity: z.enum(ACTIVITIES),
});

export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
