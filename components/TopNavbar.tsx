"use client";

import Image from "next/image";
import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FaBars,
  FaFacebookF,
  FaInstagram,
  FaSoundcloud,
  FaSpotify,
  FaXTwitter,
  FaXmark,
  FaYoutube,
} from "react-icons/fa6";
import { SiApplemusic, SiBeatport } from "react-icons/si";
import { primaryButtonClass } from "@/components/buttonStyles";

interface NavItem {
  label: string;
  href: string;
  Icon: IconType;
}

const socialItems: NavItem[] = [
  { label: "Instagram", href: "https://www.instagram.com/nothumanworld/", Icon: FaInstagram },
  { label: "Facebook", href: "https://www.facebook.com/nothumanworld", Icon: FaFacebookF },
  { label: "X", href: "https://x.com/nothumanworld", Icon: FaXTwitter },
];

const musicItems: NavItem[] = [
  { label: "SoundCloud", href: "https://soundcloud.com/nothumanworld", Icon: FaSoundcloud },
  { label: "Spotify", href: "https://open.spotify.com/search/not%20human", Icon: FaSpotify },
  { label: "YouTube", href: "https://www.youtube.com/@nothumanworld", Icon: FaYoutube },
  { label: "Apple Music", href: "https://music.apple.com/us/search?term=not%20human", Icon: SiApplemusic },
  { label: "Beatport", href: "https://www.beatport.com/search?q=not%20human", Icon: SiBeatport },
];

const allItems: NavItem[] = [...socialItems, ...musicItems];

const iconClass =
  "text-zinc-400 transition-colors duration-300 hover:text-white";

export default function TopNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-zinc-800/20">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:h-16 sm:px-6">
        {/* Logo */}
        <a href="#hero" aria-label="Back to top" className="inline-flex items-center">
          <Image
            src="/WHITE.png"
            alt="Not Human logo"
            width={40}
            height={40}
            className="h-8 w-8 object-contain sm:h-10 sm:w-10"
            priority
          />
        </a>

        {/* Desktop: all icons inline */}
        <nav aria-label="Social links" className="hidden sm:flex items-center gap-4">
          {allItems.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              className={iconClass}
            >
              <Icon size={16} aria-hidden="true" />
            </a>
          ))}
        </nav>

        {/* Mobile: burger toggle */}
        <button
          type="button"
          className="sm:hidden text-zinc-400 hover:text-white transition-colors duration-300"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <FaXmark size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="sm:hidden border-t border-zinc-800/20 px-6 py-8 flex flex-col items-center gap-8"
          role="dialog"
          aria-label="Navigation menu"
        >
          {/* Nav links */}
          <nav className="flex flex-col items-center gap-4" aria-label="Page links">
            <a
              href="https://linktr.ee/nothumanworld?utm_source=linktree_profile_share&ltsid=ef4c89df-dcdc-4645-84fa-7719000856c3"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={`${primaryButtonClass} min-w-[9rem]`}
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Listen
            </a>
            <a
              href="#dates"
              onClick={() => setOpen(false)}
              className={`${primaryButtonClass} min-w-[9rem]`}
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              Dates
            </a>
          </nav>

          {/* Social + music icons row */}
          <div className="flex flex-wrap items-center justify-center gap-5">
            {allItems.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                onClick={() => setOpen(false)}
                className={iconClass}
              >
                <Icon size={20} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
