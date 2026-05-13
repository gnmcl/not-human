import Image from "next/image";
import InteractiveMeshBackground from "@/components/InteractiveMeshBackground";

export default function Home() {
  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "#050505" }}
    >
      {/* Canvas layer — absolutely fills the section */}
      <InteractiveMeshBackground className="absolute inset-0 z-0 w-full h-full" />

      {/* Content layer — above the canvas */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center select-none">
        {/* Eyebrow label */}
      
        {/* Main title */}
        <Image
          src="/WHITE.png"
          alt="Not Human"
          width={360}
          height={420}
          style={{ width: "clamp(180px, 10vw, 360px)", height: "auto" }}
          priority
        />
        <h1 className="mt-6 text-[2.25rem] tracking-[0.1em] text-zinc-200 uppercase"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          NOT HUMAN
        </h1>

        {/* Tagline */}
        <p
          className="mt-8 text-[0.75rem] tracking-[0.4em] text-zinc-300 uppercase"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          A living signal from the edge of the machine
        </p>
      

        {/* CTAs */}
        <div className="mt-14 flex gap-10">
          <a
            href="#"
            className="border border-zinc-400 px-10 py-3.5 text-[0.7rem] tracking-[0.4em] text-zinc-100 uppercase transition-all duration-500 hover:border-red-250 hover:text-red-700"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Listen
          </a>
          <a
            href="#"
            className="border border-zinc-400 px-10 py-3.5 text-[0.7rem] tracking-[0.4em] text-zinc-100 uppercase transition-all duration-500 hover:border-red-250 hover:text-red-700"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Dates
          </a>
        </div>
      </div>
    </section>
  );
}
