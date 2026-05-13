import Image from "next/image";
import InteractiveMeshBackground from "@/components/InteractiveMeshBackground";

export default function Home() {
  return (
    <section
      className="relative min-h-screen overflow-hidden px-4 sm:px-6"
      style={{ backgroundColor: "#050505" }}
    >
      {/* Canvas layer — absolutely fills the section */}
      <InteractiveMeshBackground className="absolute inset-0 z-0 w-full h-full" />

      {/* Content layer — above the canvas */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center select-none">
        {/* Eyebrow label */}
      
        {/* Main title */}
        <Image
          src="/WHITE.png"
          alt="Not Human"
          width={360}
          height={420}
          style={{ width: "clamp(132px, 24vw, 220px)", height: "auto" }}
          priority
        />
        <h1 className="mt-4 text-[1.5rem] tracking-[0.08em] text-zinc-200 uppercase sm:mt-6 sm:text-[2.25rem] sm:tracking-[0.1em]"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          NOT HUMAN.
        </h1>

        {/* Tagline */}
        <p
          className="mt-5 max-w-[18rem] text-[0.65rem] leading-relaxed tracking-[0.28em] text-zinc-300 uppercase sm:mt-8 sm:max-w-none sm:text-[0.75rem] sm:tracking-[0.4em]"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          A living signal from the edge of the machine
        </p>
      

        {/* CTAs */}
        <div className="mt-9 flex w-full max-w-xs flex-col gap-3 sm:mt-14 sm:max-w-none sm:flex-row sm:justify-center sm:gap-10">
          <a
            href="#"
            className="inline-flex w-full items-center justify-center border border-zinc-400 px-8 py-3 text-[0.65rem] tracking-[0.35em] text-zinc-100 uppercase transition-all duration-500 hover:border-red-250 hover:text-red-700 sm:w-auto sm:px-10 sm:py-3.5 sm:text-[0.7rem] sm:tracking-[0.4em]"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Listen
          </a>
          <a
            href="#"
            className="inline-flex w-full items-center justify-center border border-zinc-400 px-8 py-3 text-[0.65rem] tracking-[0.35em] text-zinc-100 uppercase transition-all duration-500 hover:border-red-250 hover:text-red-700 sm:w-auto sm:px-10 sm:py-3.5 sm:text-[0.7rem] sm:tracking-[0.4em]"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Dates
          </a>
        </div>
      </div>
    </section>
  );
}
