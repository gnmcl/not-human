"use client";

import { useEffect, useMemo, useState } from "react";

interface ScrollSection {
  id: string;
  label: string;
}

interface SectionDotNavigatorProps {
  sections: ScrollSection[];
}

export default function SectionDotNavigator({ sections }: SectionDotNavigatorProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? "");

  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) return;

    const ratios = new Map<string, number>();
    for (const id of sectionIds) {
      ratios.set(id, 0);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let nextActive = sectionIds[0] ?? "";
        let maxRatio = -1;

        for (const id of sectionIds) {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > maxRatio) {
            maxRatio = ratio;
            nextActive = id;
          }
        }

        setActiveSection((current) => (current === nextActive ? current : nextActive));
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <nav
      className="fixed top-1/2 right-2 z-30 flex -translate-y-1/2 flex-col gap-3 sm:right-4"
      aria-label="Section navigation"
    >
      {sections.map((section) => {
        const isActive = section.id === activeSection;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => {
              const target = document.getElementById(section.id);
              target?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            aria-label={`Go to ${section.label}`}
            aria-current={isActive ? "true" : undefined}
            className={`h-1.5 w-1.5 rounded-full border border-white/70 transition-all duration-300 sm:h-1.5 sm:w-1.5 ${
              isActive ? "scale-110 bg-white opacity-100" : "bg-white/20 opacity-60 hover:opacity-90"
            }`}
          />
        );
      })}
    </nav>
  );
}
