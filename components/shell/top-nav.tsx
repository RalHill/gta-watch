"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={`text-white text-sm font-medium leading-normal hover:text-primary transition-colors ${
        active ? "text-primary" : ""
      }`}
    >
      {label}
    </Link>
  );
}

export default function TopNav() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 px-6 lg:px-12 py-3 bg-background/80 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-4 text-white">
        <div className="size-6 text-primary">
          <svg
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z"
              fill="currentColor"
              fillRule="evenodd"
            ></path>
          </svg>
        </div>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
          GTA Watch
        </h2>
      </Link>

      <div className="flex flex-1 justify-end gap-8 items-center">
        <nav className="hidden md:flex items-center gap-9">
          <NavLink href="/" label="Dashboard" />
          <NavLink href="/incidents" label="Live Map" />
          <NavLink href="/reports" label="Reports" />
          <NavLink href="/settings" label="Settings" />
        </nav>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex cursor-pointer items-center justify-center rounded-xl h-10 w-10 bg-surface-light text-white hover:bg-white/10 transition-colors"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">
              notifications
            </span>
          </button>
          <button
            type="button"
            className="flex cursor-pointer items-center justify-center rounded-xl h-10 w-10 bg-surface-light text-white hover:bg-white/10 transition-colors"
            aria-label="Profile"
          >
            <span className="material-symbols-outlined text-[20px]">
              account_circle
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

