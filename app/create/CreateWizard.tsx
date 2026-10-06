"use client";

import { useState, useTransition } from "react";
import { createInvitation } from "./actions";
import { ACTIVITIES, THEMES } from "@/lib/validations/invitation";
import { AdBanner } from "@/components/ads/AdBanner";

const THEME_LABEL = { cute: "Cute 🥺", romantic: "Romantic ❤️", funny: "Funny 😂", crazy: "Crazy 😈", simple: "Simple ✨" } as const;
const field = "mt-1 h-12 w-full rounded-2xl border bg-white px-4";

export function CreateWizard() {
  const [step, setStep] = useState(1);
  const [senderName, setSender] = useState("");
  const [recipientName, setRecipient] = useState("");
  const [message, setMessage] = useState("Will you go on a date with me? ❤️");
  const [theme, setTheme] = useState<(typeof THEMES)[number]>("romantic");
  const [dateIdea, setIdea] = useState<(typeof ACTIVITIES)[number]>("coffee");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();

  const link = slug ? `${window.location.origin}/date/${slug}` : "";
  const shareText = `Someone sent you a very important question 👀❤️\n\nOpen this:\n${link}`;
  const canNext = step === 1 ? senderName.trim() && recipientName.trim() : step === 2 ? message.trim() : true;

  const submit = () => start(async () => {
    const res = await createInvitation({ senderName, recipientName, message, theme, dateIdea });
    if (res.slug) setSlug(res.slug); else setError(res.error ?? "Something went wrong.");
  });

  if (slug) return (
    <main className="mx-auto max-w-md space-y-4 px-6 py-12 text-center">
      <h1 className="text-3xl font-bold">Send this link to them 👀</h1>
      <input readOnly value={link} aria-label="Invitation link" className={field} onFocus={(e) => e.currentTarget.select()} />
      <div className="grid grid-cols-3 gap-2">
        <button className="h-12 rounded-full bg-rose-500 font-semibold text-white" onClick={async () => { await navigator.clipboard.writeText(link); setCopied(true); }}>{copied ? "Copied ✓" : "Copy Link"}</button>
        <a className="flex h-12 items-center justify-center rounded-full border font-semibold" target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}>WhatsApp</a>
        <button className="h-12 rounded-full border font-semibold" onClick={() => (navigator.share ? navigator.share({ text: shareText, url: link }) : navigator.clipboard.writeText(shareText))}>Share</button>
      </div>
      {/* Adsterra banner */}
      <AdBanner className="mt-4" />
    </main>
  );

  return (
    <main className="mx-auto max-w-md space-y-6 px-6 py-12">
      <p className="text-sm text-neutral-500">Step {step} of 4</p>
      {step === 1 && (<>
        <h1 className="text-2xl font-bold">Who are you asking out?</h1>
        <label className="block text-sm">Your name<input className={field} value={senderName} maxLength={40} onChange={(e) => setSender(e.target.value)} /></label>
        <label className="block text-sm">Their name<input className={field} value={recipientName} maxLength={40} onChange={(e) => setRecipient(e.target.value)} /></label>
      </>)}
      {step === 2 && (<>
        <h1 className="text-2xl font-bold">Write your message</h1>
        <label className="block text-sm">Message ({message.length}/140)<textarea className="mt-1 w-full rounded-2xl border bg-white p-4" rows={3} maxLength={140} value={message} onChange={(e) => setMessage(e.target.value)} /></label>
        <div className="rounded-3xl bg-white p-6 text-center shadow"><p className="font-bold">Hey {recipientName || "…"} ❤️</p><p>{message}</p></div>
      </>)}
      {step === 3 && (<>
        <h1 className="text-2xl font-bold">Choose your vibe</h1>
        <div className="flex flex-wrap gap-2">{THEMES.map((t) => <button key={t} aria-pressed={theme === t} onClick={() => setTheme(t)} className={`rounded-full border px-4 py-3 ${theme === t ? "border-rose-500 bg-rose-50 font-semibold" : "bg-white"}`}>{THEME_LABEL[t]}</button>)}</div>
      </>)}
      {step === 4 && (<>
        <h1 className="text-2xl font-bold">Choose your date idea</h1>
        <div className="grid grid-cols-3 gap-2">{ACTIVITIES.map((a) => <button key={a} aria-pressed={dateIdea === a} onClick={() => setIdea(a)} className={`rounded-2xl border p-3 text-sm capitalize ${dateIdea === a ? "border-rose-500 bg-rose-50 font-semibold" : "bg-white"}`}>{a}</button>)}</div>
      </>)}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        {step > 1 && <button className="h-14 flex-1 rounded-full border font-semibold" onClick={() => setStep(step - 1)}>Back</button>}
        {step < 4
          ? <button disabled={!canNext} className="h-14 flex-1 rounded-full bg-rose-500 font-semibold text-white disabled:opacity-50" onClick={() => setStep(step + 1)}>Next</button>
          : <button disabled={pending} className="h-14 flex-1 rounded-full bg-rose-500 font-semibold text-white disabled:opacity-50" onClick={submit}>{pending ? "Creating…" : "Create My Link ❤️"}</button>}
      </div>
    </main>
  );
}
