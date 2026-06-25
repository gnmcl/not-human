import { primaryButtonClass } from "@/components/buttonStyles";
import InteractiveMeshBackground from "@/components/InteractiveMeshBackground";
import Link from "next/link";

export default function BioPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505]">
      <InteractiveMeshBackground className="absolute inset-0 z-0 w-full h-full" />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-6 pb-24 pt-28 sm:pt-36 sm:pb-32 select-none">

        {/* Header */}
        <p
          className="mb-5 text-[0.55rem] tracking-[0.5em] text-zinc-600 uppercase sm:text-[0.6rem]"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Est. 2025
        </p>

        <h1
          className="text-[2rem] tracking-[0.22em] text-zinc-100 uppercase sm:text-[2.8rem]"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          NOT HUMAN
        </h1>

        <div className="mt-5 h-px w-12 bg-zinc-700 sm:w-20" />

        {/* Bio text */}
        <div
          className="mt-16 max-w-2xl space-y-7"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          <p className="text-[0.7rem] leading-[2.1] tracking-[0.04em] text-zinc-500 sm:text-[0.75rem]">
            Launched in 2025, NOT HUMAN is a melodic techno project created by an anonymous Italian DJ and producer who has chosen to remain behind the mask, allowing the music itself to become the true identity of the project.
          </p>

          <p className="text-[0.7rem] leading-[2.1] tracking-[0.04em] text-zinc-500 sm:text-[0.75rem]">
            At its core, NOT HUMAN is driven by a desire for artistic freedom, where sound, emotion and spirituality merge into a single experience. The figure behind the mask represents both a character and a broader concept: an artistic entity that uses music as a medium to explore universal themes connected to existence, consciousness, emotions and the human condition.
          </p>

          <p className="text-[0.7rem] leading-[2.1] tracking-[0.04em] text-zinc-500 sm:text-[0.75rem]">
            Through a blend of evocative soundscapes, symbolism and metaphorical storytelling, NOT HUMAN transforms music into a language capable of expressing ideas and feelings that often transcend words, inviting listeners into an experience that is both emotional and deeply personal.
          </p>

          <p className="border-l border-zinc-700 pl-5 text-[0.7rem] leading-[2.1] tracking-[0.04em] text-zinc-400 sm:text-[0.75rem]">
            The name NOT HUMAN reflects this vision: a symbol that moves beyond individual identity and places the focus on the message, the music and the connection between artist and audience.
          </p>

          <p className="text-[0.7rem] leading-[2.1] tracking-[0.04em] text-zinc-500 sm:text-[0.75rem]">
            The artist behind the project began his production journey in 2017, gradually developing a sound shaped by years of experimentation, musical exploration and involvement within the electronic music scene. Prior to the launch of NOT HUMAN, he was part of a melodic techno duo that held a resident position at a renowned Italian club, sharing line-ups with respected artists such as Markantonio, David Allendes, Luigi Madonna and other notable names in contemporary electronic music.
          </p>

          <p className="text-[0.7rem] leading-[2.1] tracking-[0.04em] text-zinc-500 sm:text-[0.75rem]">
            Musically, NOT HUMAN blends melodic techno with subtle trance influences, creating immersive atmospheres, emotional melodies and powerful sonic journeys. The project aims to bridge introspection and dancefloor energy, delivering music that resonates on both an emotional and physical level.
          </p>

          <p className="text-[0.7rem] leading-[2.1] tracking-[0.04em] text-zinc-500 sm:text-[0.75rem]">
            While the project is still at the beginning of its discographic journey, the first original release is scheduled for the near future and will mark the official start of NOT HUMAN&apos;s production catalogue.
          </p>

          <p className="text-[0.7rem] leading-[2.1] tracking-[0.04em] text-zinc-500 sm:text-[0.75rem]">
            Recently, a live DJ set was released, recorded within the historic setting of the Certosa di San Lorenzo, a UNESCO World Heritage Site renowned for its artistic, cultural and spiritual significance. Available on YouTube, the performance serves as the first audiovisual statement of the NOT HUMAN universe, showcasing the project&apos;s aesthetic vision and musical identity in a location where history, architecture and emotion converge.
          </p>

          {/* Final statement */}
          <div className="pt-6 border-t border-zinc-800">
            <p className="text-[0.68rem] leading-[2.2] tracking-[0.12em] text-zinc-300 uppercase sm:text-[0.73rem]">
              NOT HUMAN is more than an artist.&nbsp; It is a concept brought to life through music, transforming sound into emotion, connection and experience.
            </p>
          </div>
        </div>

        <Link
          href="/"
          className={`${primaryButtonClass} mt-16`}
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Back
        </Link>
      </div>
    </section>
  );
}