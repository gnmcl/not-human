"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface YouTubeHeroSectionProps {
  id: string;
  videoId: string;
}

export default function YouTubeHeroSection({ id, videoId }: YouTubeHeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "200px 0px 200px 0px",
        threshold: 0.01,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
  const previewUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <section
      id={id}
      ref={sectionRef}
      data-scroll-section
      className="relative z-10 min-h-screen overflow-hidden"
      aria-label="Featured video"
    >
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/35" aria-hidden="true" />

      <div className="absolute inset-0 z-0 flex items-center justify-center p-3 sm:p-6">
        <div className="relative h-[80%] w-[80%] overflow-hidden rounded-md border border-zinc-700/60 bg-black">
          {!shouldLoadVideo && (
            <Image
              src={previewUrl}
              alt="Video preview"
              fill
              priority={false}
              className="object-cover"
              sizes="(max-width: 768px) 80vw, 80vw"
            />
          )}

          {shouldLoadVideo && (
            <iframe
              src={embedUrl}
              className="absolute inset-0 h-full w-full"
              title="Not Human featured video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )}
        </div>
      </div>

      <div className="pointer-events-none relative z-20 flex min-h-screen flex-col items-center justify-end px-4 pb-12 text-center sm:pb-16">
        <a
          href="https://www.youtube.com/@nothumanworld"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto text-[1rem] tracking-[0.18em] text-zinc-100/80 uppercase transition-colors duration-300 hover:text-white sm:text-[0.7rem] lg:text-[0.9rem]"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          SEE MORE &gt;
        </a>
      </div>
    </section>
  );
}
