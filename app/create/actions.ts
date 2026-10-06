"use server";

import { randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createInvitationSchema } from "@/lib/validations/invitation";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
const makeSlug = () => Array.from(randomBytes(8), (b) => ALPHABET[b % ALPHABET.length]).join("");

export async function createInvitation(input: unknown): Promise<{ slug?: string; error?: string }> {
  const parsed = createInvitationSchema.safeParse(input);
  if (!parsed.success) return { error: "Please check your details." };
  const { senderName, recipientName, message, theme, dateIdea } = parsed.data;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  for (let i = 0; i < 3; i++) {
    const slug = makeSlug();
    const { error } = await supabase.from("invitations").insert({
      slug, sender_name: senderName, recipient_name: recipientName, message, theme, date_idea: dateIdea, user_id: user?.id ?? null,
    });
    if (!error) return { slug };
    if (error.code !== "23505") break; // retry only on slug collision
  }
  return { error: "Could not create your invitation. Try again." };
}
