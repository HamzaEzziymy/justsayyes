"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EscapingNoButton } from "./EscapingNoButton";
import { NO_GIVE_UP } from "./messages";
import { ACTIVITIES } from "@/lib/validations/invitation";
import { track, submitDate } from "./actions";

const ACTIVITY_LABEL: Record<(typeof ACTIVITIES)[number], string> = {
  coffee: "☕ Coffee", pizza: "🍕 Pizza", cinema: "🎬 Cinema", sunset: "🌅 Sunset Walk",
  dinner: "🍽️ Dinner", gaming: "🎮 Gaming", beach: "🏖️ Beach", surprise: "🎁 Surprise", custom: "✨ Custom",
};

type Props = { slug: string; senderName: string; recipientName: string; message: string };
type Step = "ask" | "celebrate" | "pick" | "done";

export function InvitationExperience({ slug, senderName, recipientName, message }: Props) {
  const yesRef = useRef<HTMLButtonElement>(null);
  const [step, setStep] = useState<Step>("ask");
  const [hint, setHint] = useState("");
  const [gaveUp, setGaveUp] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [activity, setActivity] = useState<(typeof ACTIVITIES)[number]>("coffee");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  useEffect(() => { void track(slug, "view"); }, [slug]);

  const sayYes = () => {
    void track(slug, "yes_click");
    setStep("celebrate");
    setTimeout(() => setStep("pick"), 1600);
  };

  const confirm = () => {
    setError("");
    start(async () => {
      const ok = await submitDate({ slug, date, time, activity });
      if (ok) setStep("done"); else setError("Something went wrong. Check the date and try again 🥺");
    });
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-6 py-10 text-center">
      <AnimatePresence mode="wait">
        {step === "ask" && (
          <motion.section key="ask" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full space-y-6">
            <p className="text-sm font-medium text-rose-600">💌 You have a date invitation</p>
            <h1 className="text-3xl font-bold">Hey {recipientName} ❤️</h1>
            <p className="text-xl">{message}</p>
            <div className="flex items-center justify-center gap-4">
              <button ref={yesRef} onClick={sayYes}
                className="h-14 min-w-32 rounded-full bg-rose-500 px-8 text-lg font-semibold text-white shadow-lg transition hover:bg-rose-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-500">
                YES ❤️
              </button>
              <EscapingNoButton yesRef={yesRef} onAttempt={() => void track(slug, "no_click")}
                onMessage={setHint} onGiveUp={() => setGaveUp(true)} />
            </div>
            <p aria-live="polite" className="min-h-6 text-neutral-600">{gaveUp ? NO_GIVE_UP : hint}</p>
          </motion.section>
        )}

        {step === "celebrate" && (
          <motion.h1 key="cel" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }} className="text-5xl font-extrabold">
            YAAAAAY! ❤️
          </motion.h1>
        )}

        {step === "pick" && (
          <motion.section key="pick" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-5">
            <h1 className="text-2xl font-bold">Let&apos;s make it official.</h1>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-left text-sm">Date
                <input type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)}
                  className="mt-1 h-12 w-full rounded-2xl border px-3" />
              </label>
              <label className="text-left text-sm">Time
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 h-12 w-full rounded-2xl border px-3" />
              </label>
            </div>
            <div role="radiogroup" aria-label="Activity" className="grid grid-cols-3 gap-2">
              {ACTIVITIES.map((a) => (
                <button key={a} role="radio" aria-checked={activity === a} onClick={() => setActivity(a)}
                  className={`rounded-2xl border p-3 text-sm ${activity === a ? "border-rose-500 bg-rose-50 font-semibold" : ""}`}>
                  {ACTIVITY_LABEL[a]}
                </button>
              ))}
            </div>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            <button onClick={confirm} disabled={!date || pending}
              className="h-14 w-full rounded-full bg-rose-500 text-lg font-semibold text-white disabled:opacity-50">
              {pending ? "Confirming…" : "Confirm Date ❤️"}
            </button>
          </motion.section>
        )}

        {step === "done" && (
          <motion.section key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full space-y-4 rounded-3xl bg-rose-50 p-8">
            <h1 className="text-3xl font-extrabold">IT&apos;S A DATE! ❤️</h1>
            <p className="text-lg">{recipientName} + {senderName}</p>
            <p>{new Date(date + "T00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} · {time}</p>
            <p>{ACTIVITY_LABEL[activity]}</p>
            <a href="/create" className="inline-block rounded-full bg-rose-500 px-6 py-3 font-semibold text-white">Create Your Own ❤️</a>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}
