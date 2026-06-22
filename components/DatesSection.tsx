interface DatesSectionProps {
  id?: string;
}

export default function DatesSection({ id = "dates" }: DatesSectionProps) {
  return (
    <section
      id={id}
      data-scroll-section
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center select-none"
    >
      <p
        className="mb-6 text-[0.6rem] tracking-[0.45em] text-zinc-500 uppercase sm:text-[0.65rem]"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        Dates
      </p>
      <h2
        className="text-[2.5rem] tracking-[0.18em] text-zinc-200 uppercase sm:text-[5rem] sm:tracking-[0.22em]"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        COMING SOON
      </h2>
      <div className="mt-2 h-px w-16 bg-zinc-600 sm:w-24" />
    </section>
  );
}
