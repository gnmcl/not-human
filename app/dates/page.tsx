import Link from "next/link";
import InteractiveMeshBackground from "@/components/InteractiveMeshBackground";

export default function Dates() {
  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "#050505" }}
    >
      <InteractiveMeshBackground className="absolute inset-0 z-0 w-full h-full" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center select-none px-4">
        <p
          className="text-[0.6rem] tracking-[0.45em] text-zinc-500 uppercase mb-6 sm:text-[0.65rem]"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Dates
        </p>
        <h1
          className="text-[2.8rem] tracking-[0.18em] text-zinc-200 uppercase sm:text-[5rem] sm:tracking-[0.22em]"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          COMING SOON
        </h1>
        <div className="mt-2 h-px w-16 bg-zinc-600 sm:w-24" />
        <Link
          href="/"
          className="mt-14 inline-flex items-center justify-center border border-zinc-700 px-8 py-3 text-[0.6rem] tracking-[0.35em] text-zinc-400 uppercase transition-all duration-500 hover:border-zinc-400 hover:text-zinc-100 sm:px-10 sm:py-3.5 sm:text-[0.65rem] sm:tracking-[0.4em]"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Back
        </Link>
      </div>
    </section>
  );
}
