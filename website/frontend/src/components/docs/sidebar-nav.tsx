"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const DOC_PAGES = [
  { href: "/documentation", label: "Overview" },
  { href: "/documentation/methodology", label: "Methodology" },
  { href: "/documentation/results", label: "Results" },
  { href: "/documentation/team", label: "Team" },
  { href: "/documentation/references", label: "References" },
];

function isActive(pathname: string | null, href: string) {
  return href === "/documentation"
    ? pathname === "/documentation"
    : !!pathname?.startsWith(href);
}

export function DocsSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-24 hidden shrink-0 md:block md:w-44 lg:w-52">
      <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Documentation
      </div>
      <ul className="mt-3 space-y-0.5 border-l border-border">
        {DOC_PAGES.map((page) => {
          const active = isActive(pathname, page.href);
          return (
            <li key={page.href}>
              <Link
                href={page.href}
                className={cn(
                  "-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors",
                  active
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {page.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function DocsMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 md:hidden">
      {DOC_PAGES.map((page) => {
        const active = isActive(pathname, page.href);
        return (
          <Link
            key={page.href}
            href={page.href}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {page.label}
          </Link>
        );
      })}
    </nav>
  );
}
