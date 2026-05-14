"use client";

import { useEffect, useState } from "react";

const PHRASE = "A LIVING SIGNAL FROM THE EDGE OF THE MACHINE";
const TYPE_SPEED_MS = 55; // delay per character
const START_DELAY_MS = 400;

function formatLastLogin(d: Date): string {
  // Esempio: "Thu May 14 01:15:38 on ttys000"
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${days[d.getDay()]} ${months[d.getMonth()]} ${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())} on ttys000`;
}

export default function TerminalTagline() {
  const [lastLogin, setLastLogin] = useState<string>("");
  const [typed, setTyped] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);

  // Genera la stringa "Last login" lato client per evitare mismatch SSR.
  useEffect(() => {
    setLastLogin(formatLastLogin(new Date()));
  }, []);

  // Effetto macchina da scrivere
  useEffect(() => {
    let i = 0;
    let typeTimer: ReturnType<typeof setTimeout>;

    const tick = () => {
      i += 1;
      setTyped(PHRASE.slice(0, i));
      if (i < PHRASE.length) {
        typeTimer = setTimeout(tick, TYPE_SPEED_MS);
      } else {
        setDone(true);
      }
    };

    const startTimer = setTimeout(tick, START_DELAY_MS);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(typeTimer);
    };
  }, []);

  return (
    <div
      className="mx-auto mt-5 w-full max-w-[20rem] text-center text-left text-[0.65rem] leading-relaxed text-zinc-300 sm:mt-8 sm:max-w-[36rem] sm:text-[0.8rem]"
      style={{ fontFamily: "var(--font-geist-mono)" }}
      aria-label={PHRASE}
    >
      <p className="text-zinc-500" aria-hidden="true">
        {lastLogin ? `Last login: ${lastLogin}` : "\u00A0"}
      </p>
      <p className="mt-1 break-words">
        <span className="text-zinc-500">newUser@192 ~ %</span>{" "}
        <span className="text-zinc-200">{typed}</span>
        <span
          aria-hidden="true"
          className={`terminal-caret ${done ? "is-blinking" : ""}`}
        >
          _
        </span>
      </p>

      <style jsx>{`
        .terminal-caret {
          display: inline-block;
          margin-left: 2px;
          color: rgb(228 228 231); /* zinc-200 */
          transform: translateY(-1px);
        }
        .terminal-caret.is-blinking {
          animation: terminal-blink 1s steps(1, end) infinite;
        }
        @keyframes terminal-blink {
          0%, 50% { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
