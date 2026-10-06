import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugSchema } from "@/lib/validations/invitation";
import { InvitationExperience } from "@/components/invitation/InvitationExperience";

type Params = { params: Promise<{ slug: string }> };

async function load(slug: string) {
  if (!slugSchema.safeParse(slug).success) return null;
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_public_invitation", { p_slug: slug });
  return (data?.[0] as { sender_name: string; recipient_name: string; message: string; status: string } | undefined) ?? null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const inv = await load((await params).slug);
  return {
    title: "Someone has a question for you... ❤️",
    description: inv ? `${inv.message} Open your invitation 👀` : "Open your invitation 👀",
    robots: { index: false },
    openGraph: { title: "Someone has a question for you... ❤️", description: "Open your invitation 👀" },
  };
}

function Notice({ title, cta }: { title: string; cta?: boolean }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      {cta && <Link href="/create" className="rounded-full bg-rose-500 px-6 py-3 font-semibold text-white">Create Your Own ❤️</Link>}
    </main>
  );
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const inv = await load(slug);
  if (!inv) notFound();
  if (inv.status === "expired") return <Notice title="This invitation has expired." cta />;
  if (inv.status === "accepted") return <Notice title="You already answered this invitation ❤️" cta />;
  return <InvitationExperience slug={slug} senderName={inv.sender_name} recipientName={inv.recipient_name} message={inv.message} />;
}
