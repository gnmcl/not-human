import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaSoundcloud,
  FaSpotify,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { SiApplemusic, SiBeatport } from "react-icons/si";
import { primaryButtonClass } from "@/components/buttonStyles";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Cookie Settings", href: "/cookie-settings" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
];

const allSocialItems = [
  { label: "Instagram", href: "https://www.instagram.com/nothuman.ofc/", Icon: FaInstagram },
  //{ label: "Facebook", href: "https://www.facebook.com/nothumanworld", Icon: FaFacebookF },
  //{ label: "X", href: "https://x.com/nothumanworld", Icon: FaXTwitter },
  { label: "SoundCloud", href: "https://soundcloud.com/nothumanworld", Icon: FaSoundcloud },
  //{ label: "Spotify", href: "https://open.spotify.com/search/not%20human", Icon: FaSpotify },
  { label: "YouTube", href: "https://www.youtube.com/@nothumanworld", Icon: FaYoutube },
  //{ label: "Apple Music", href: "https://music.apple.com/us/search?term=not%20human", Icon: SiApplemusic },
  //{ label: "Beatport", href: "https://www.beatport.com/search?q=not%20human", Icon: SiBeatport },
];

export default function Footer() {
  return (
    <footer
      className="relative z-10 bg-black px-4 py-14 sm:px-8 sm:py-16"
      style={{ fontFamily: "var(--font-geist-mono)" }}
    >
      <div className="mx-auto max-w-screen-lg flex flex-col items-center gap-10">

        {/* BOOKING & CONTACTS */}
        <div className="flex flex-col items-center gap-3">
          <Link
            href="/contacts"
            className={primaryButtonClass}
          >
            BOOKING &amp; CONTACTS
          </Link>
        </div>

        {/* Social icons — "Join my world:" label left on desktop, above on mobile */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5">
          <span className="text-[0.55rem] tracking-[0.3em] text-zinc-500 uppercase sm:text-[0.58rem]">
            Join my world:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {allSocialItems.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="text-zinc-500 transition-colors duration-300 hover:text-white"
              >
                <Icon size={14} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-[0.52rem] tracking-[0.3em] text-zinc-600 uppercase select-none">
          &copy; {new Date().getFullYear()} Not Human. All rights reserved.
        </p>

        {/* Divider */}
        <div className="h-px w-full bg-zinc-800" />

        {/* Legal links — one row on desktop, column on mobile */}
        <nav
          aria-label="Legal links"
          className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6"
        >
          {legalLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-[0.55rem] tracking-[0.28em] text-zinc-600 uppercase transition-colors duration-300 hover:text-zinc-300 sm:text-[0.57rem]"
            >
              {label}
            </Link>
          ))}
        </nav>

      </div>
    </footer>
  );
}
