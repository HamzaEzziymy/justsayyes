"use server";

import { createClient } from "@/lib/supabase/server";
import { slugSchema, submitDateSchema } from "@/lib/validations/invitation";

export async function track(slug: string, type: "view" | "no_click" | "yes_click") {
  if (!slugSchema.safeParse(slug).success) return;
  const supabase = await createClient();
  await supabase.rpc("record_invitation_event", { p_slug: slug, p_type: type });
}

export async function submitDate(input: unknown): Promise<boolean> {
  const parsed = submitDateSchema.safeParse(input);
  if (!parsed.success) return false;
  const { slug, date, time, activity } = parsed.data;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("submit_date", { p_slug: slug, p_date: date, p_time: time, p_activity: activity });
  return !error && data === true;
}
