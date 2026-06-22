import Image from "next/image";
import InteractiveMeshBackground from "@/components/InteractiveMeshBackground";
import DatesSection from "@/components/DatesSection";
import SectionDotNavigator from "@/components/SectionDotNavigator";
import YouTubeHeroSection from "@/components/YouTubeHeroSection";

const sections = [
  { id: "hero", label: "Hero" },
  { id: "video", label: "Video" },
  { id: "dates", label: "Dates" },
];

const FEATURED_VIDEO_ID = "xBfc9E34fC0";

export default function Home() {
  return (
    <>
      <InteractiveMeshBackground className="pointer-events-none fixed inset-0 z-0 h-screen w-screen" />

      <main className="relative z-10">
        <section
          id="hero"
          data-scroll-section
          className="relative min-h-screen overflow-hidden px-4 sm:px-6"
        >
          <div className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center select-none">
            <Image
              src="/WHITE.png"
              alt="Not Human"
              width={360}
              height={420}
              style={{ width: "clamp(132px, 24vw, 220px)", height: "auto" }}
              priority
            />
            <h1
              className="mt-4 text-[1.4rem] font-bold tracking-[0.19em] text-zinc-200 uppercase sm:mt-6 sm:text-[2.00rem] sm:tracking-[0.21em]"
              style={{
                fontFamily: "var(--font-geist-sans)",
                display: "inline-block",
                transform: "scaleY(0.97)",
              }}
            >
              NOT HUMAN
            </h1>
            <div
              className="mt-4 max-w-[20rem] text-[0.65rem] text-zinc-200 sm:mt-4 sm:max-w-[36rem] sm:text-[0.8rem]"
              style={{ wordSpacing: "0.28em" }}
            >
              &quot;A LIVING SIGNAL FROM THE EDGE OF THE MACHINE&quot;
            </div>

            <div className="mt-9 flex w-full max-w-xs flex-col gap-3 sm:mt-14 sm:max-w-none sm:flex-row sm:justify-center sm:gap-10">
              <a
                href="https://linktr.ee/nothumanworld?utm_source=linktree_profile_share&ltsid=ef4c89df-dcdc-4645-84fa-7719000856c3"
                className="inline-flex w-full items-center justify-center border border-zinc-400 px-8 py-3 text-[0.65rem] tracking-[0.35em] text-zinc-100 uppercase transition-all duration-500 hover:border-red-250 hover:text-red-700 sm:w-auto sm:px-10 sm:py-3.5 sm:text-[0.7rem] sm:tracking-[0.4em]"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                Listen
              </a>
              <a
                href="#dates"
                className="inline-flex w-full items-center justify-center border border-zinc-400 px-8 py-3 text-[0.65rem] tracking-[0.35em] text-zinc-100 uppercase transition-all duration-500 hover:border-red-250 hover:text-red-700 sm:w-auto sm:px-10 sm:py-3.5 sm:text-[0.7rem] sm:tracking-[0.4em]"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                Dates
              </a>
            </div>
          </div>

          <p
            className="absolute right-0 bottom-5 left-0 z-10 text-center text-[0.55rem] tracking-[0.3em] text-zinc-500 uppercase select-none"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            &copy; {new Date().getFullYear()} Not Human. All rights reserved.
          </p>
        </section>

        <YouTubeHeroSection id="video" videoId={FEATURED_VIDEO_ID} />
        <DatesSection id="dates" />
      </main>

      <SectionDotNavigator sections={sections} />
    </>
  );
}
