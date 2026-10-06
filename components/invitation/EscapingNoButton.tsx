"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { NO_MESSAGES } from "./messages";

type Pos = { x: number; y: number };
const MARGIN = 16;

function overlaps(a: DOMRect, b: DOMRect, pad = 24) {
  return !(a.right + pad < b.left || a.left - pad > b.right || a.bottom + pad < b.top || a.top - pad > b.bottom);
}

/**
 * Escaping NO button: dodges on mouse-enter and on touch/pointer-down, stays inside the
 * viewport, avoids the YES button, springs between positions, and gives up after the last
 * message so the user is never trapped.
 */
export function EscapingNoButton({
  yesRef, onAttempt, onMessage, onGiveUp, label = "NO 😈",
}: {
  yesRef: React.RefObject<HTMLElement | null>;
  onAttempt: () => void;
  onMessage: (msg: string) => void;
  onGiveUp: () => void;
  label?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const attempts = useRef(0);
  const [pos, setPos] = useState<Pos | null>(null);
  const [tired, setTired] = useState(false);

  const escape = useCallback(() => {
    const el = ref.current;
    if (!el || tired) return;
    const w = el.offsetWidth, h = el.offsetHeight;
    const vw = window.innerWidth, vh = window.innerHeight;
    const yes = yesRef.current?.getBoundingClientRect();

    let next: Pos = { x: MARGIN, y: MARGIN };
    for (let i = 0; i < 30; i++) {
      const x = MARGIN + Math.random() * Math.max(0, vw - w - MARGIN * 2);
      const y = MARGIN + Math.random() * Math.max(0, vh - h - MARGIN * 2);
      if (!yes || !overlaps(new DOMRect(x, y, w, h), yes)) { next = { x, y }; break; }
    }
    setPos(next);

    onAttempt();
    const n = attempts.current++;
    onMessage(NO_MESSAGES[Math.min(n, NO_MESSAGES.length - 1)]);
    if (n + 1 >= NO_MESSAGES.length) { setTired(true); onGiveUp(); }
  }, [onAttempt, onMessage, onGiveUp, tired, yesRef]);

  return (
    <>
      {pos && <span aria-hidden className="inline-block h-14 w-32" />}
      <motion.button
        ref={ref}
        type="button"
        onPointerEnter={(e) => { if (e.pointerType === "mouse") escape(); }}
        onPointerDown={(e) => { if (e.pointerType !== "mouse") { e.preventDefault(); escape(); } }}
        onClick={escape}
        animate={pos ? { x: pos.x, y: pos.y } : { x: 0, y: 0 }}
        transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 260, damping: 18 }}
        style={pos ? { position: "fixed", left: 0, top: 0, zIndex: 20 } : undefined}
        className="h-14 min-w-32 touch-none rounded-full bg-neutral-900 px-8 text-lg font-semibold text-white shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-500"
        aria-label="No (this button likes to run away)"
      >
        {label}
      </motion.button>
    </>
  );
}
