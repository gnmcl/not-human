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
        className="mb-6 text-[0.8rem] font-bold tracking-[0.45em] text-zinc-500 uppercase sm:text-[0.75rem]"
        style={{ fontFamily: "var(--font-geist-mono)" }}
      >
        Dates
      </p>
      <h2
        className="text-[2.4rem] tracking-[0.18em] text-zinc-200 uppercase sm:text-[3.4rem] sm:tracking-[0.22em]"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        COMING SOON
      </h2>
    </section>
  );
}
