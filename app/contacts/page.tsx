import Link from "next/link";
import InteractiveMeshBackground from "@/components/InteractiveMeshBackground";

export const metadata = {
  title: "Booking & Contacts — Not Human",
  description: "Book Not Human for events and get in touch.",
};

export default function ContactsPage() {
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#050505]"
    >
      <InteractiveMeshBackground className="absolute inset-0 z-0 w-full h-full" />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center select-none">
        <p
          className="mb-6 text-[0.6rem] tracking-[0.45em] text-zinc-500 uppercase sm:text-[0.65rem]"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Booking &amp; Contacts
        </p>

        <h1
          className="text-[2.2rem] tracking-[0.16em] text-zinc-200 uppercase sm:text-[4rem] sm:tracking-[0.2em]"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          GET IN TOUCH
        </h1>

        <div className="mt-2 h-px w-16 bg-zinc-600 sm:w-24" />

        <a
          href="mailto:booking@nothumanworld.com"
          className="mt-10 text-[0.65rem] tracking-[0.35em] text-zinc-400 uppercase transition-colors duration-300 hover:text-zinc-100 sm:text-[0.72rem]"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          booking@nothumanworld.com
        </a>

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
