"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  FaBars,
  FaInstagram,
  FaSoundcloud,
  FaXmark,
  FaYoutube,
} from "react-icons/fa6";

interface NavItem {
  label: string;
  href: string;
  Icon: IconType;
}

const socialItems: NavItem[] = [
  { label: "Instagram", href: "https://www.instagram.com/nothuman.ofc/", Icon: FaInstagram },
];

const musicItems: NavItem[] = [
  { label: "SoundCloud", href: "https://soundcloud.com/nothumanofc", Icon: FaSoundcloud },
  { label: "YouTube", href: "https://www.youtube.com/@nothumanworld", Icon: FaYoutube },
];

const allItems: NavItem[] = [...socialItems, ...musicItems];

const pageLinks = [
  { label: "Home", href: "/#hero" },
  { label: "Who Is Not Human", href: "/bio" },
  { label: "Dates", href: "/#dates" },
  { label: "Booking & Contacts", href: "/contacts" },
  { label: "Listen", href: "https://linktr.ee/nothumanworld?utm_source=linktree_profile_share&ltsid=ef4c89df-dcdc-4645-84fa-7719000856c3", external: true },
];

const iconClass = "text-zinc-500 transition-colors duration-300 hover:text-white";

export default function TopNavbar() {
  const [open, setOpen] = useState(false);

  // lock scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-zinc-800/20">
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:h-16 sm:px-6">
          {/* Logo */}
          <Link href="/#hero" aria-label="Back to top" className="inline-flex items-center" onClick={close}>
            <Image
              src="/WHITE.png"
              alt="Not Human logo"
              width={40}
              height={40}
              className="h-8 w-8 object-contain sm:h-10 sm:w-10"
              priority
            />
          </Link>

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

          {/* Mobile: burger / close toggle */}
          <button
            type="button"
            className="relative z-[60] sm:hidden text-zinc-400 hover:text-white transition-colors duration-300"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${open ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}
            >
              <FaXmark size={18} />
            </span>
            <span
              className={`flex items-center justify-center transition-all duration-300 ${open ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`}
            >
              <FaBars size={18} />
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen mobile overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#050505]/[0.97] backdrop-blur-sm sm:hidden transition-all duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Page nav links */}
        <nav className="flex flex-col items-center gap-7 select-none" aria-label="Page links">
          {pageLinks.map(({ label, href, external }) =>
            external ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className={`text-[1.25rem] tracking-[0.2em] text-zinc-600 uppercase transition-colors duration-300 hover:text-zinc-100 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ fontFamily: "var(--font-geist-sans)", transitionDelay: open ? "120ms" : "0ms" }}
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                onClick={close}
                className={`text-[1.25rem] tracking-[0.2em] text-zinc-600 uppercase transition-colors duration-300 hover:text-zinc-100 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ fontFamily: "var(--font-geist-sans)", transitionDelay: open ? "120ms" : "0ms" }}
              >
                {label}
              </Link>
            )
          )}
        </nav>

        {/* Divider */}
        <div className="mt-14 mb-10 h-px w-8 bg-zinc-800" />

        {/* Social icons */}
        <div className="flex items-center gap-7">
          {allItems.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              title={label}
              onClick={close}
              className="text-zinc-600 transition-colors duration-300 hover:text-white"
            >
              <Icon size={20} aria-hidden="true" />
            </a>
          ))}
        </div>

        {/* Bottom label */}
        <p
          className="absolute bottom-10 text-[0.5rem] tracking-[0.5em] text-zinc-800 uppercase"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          Not Human &copy; 2025
        </p>
      </div>
    </>
  );
}
