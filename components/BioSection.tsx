import Link from "next/link";

interface BioSectionProps {
  id?: string;
}

export default function BioSection({ id = "bio" }: BioSectionProps) {
  return (
    <section
      id={id}
      data-scroll-section
      className="relative flex items-center justify-center bg-[#0b0b0b] py-8 px-6 sm:py-10"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-zinc-800/50" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-zinc-800/50" />

      <div className="flex flex-col items-center gap-5 select-none text-center">
        <p
          className="text-[0.5rem] tracking-[0.55em] text-zinc-300 uppercase sm:text-[0.75rem]"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          The Concept
        </p>

        <Link href="/bio" className="group flex flex-col items-center gap-4">
          <span
            className="text-[1.3rem] tracking-[0.2em] text-zinc-300 uppercase transition-colors duration-500 group-hover:text-zinc-100 sm:text-[1.9rem] sm:tracking-[0.26em]"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            WHO IS NOT HUMAN
          </span>

          {/* animated underline */}
          <span className="h-px w-8 bg-zinc-700 transition-all duration-500 group-hover:w-full group-hover:bg-zinc-400" />

          <span
            className="text-[0.7rem] tracking-[0.45em] text-zinc-200 uppercase transition-colors duration-500 group-hover:text-zinc-600 sm:text-[0.65rem]"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Discover &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}   