"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { List } from "@phosphor-icons/react/dist/ssr/List";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { LogoMark } from "@/components/logo-mark";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/product", label: "Product" },
  { href: "/experiences", label: "Experiences" },
  { href: "/documentation", label: "Documentation" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-foreground"
          onClick={() => setOpen(false)}
        >
          <LogoMark className="size-5" />
          <span className="text-xl font-semibold tracking-tight">
            DermaDiff
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3.5 -bottom-[1px] h-[2px] rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild size="sm" className="group">
            <Link href="/product">
              Try the classifier
              <ArrowUpRight
                weight="bold"
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
          >
            <List weight="bold" className="size-5" />
          </Button>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
                <LogoMark className="size-4" />
                DermaDiff
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {LINKS.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2.5 text-base font-medium transition-colors",
                      active
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto p-4">
              <Button asChild className="w-full">
                <Link href="/product" onClick={() => setOpen(false)}>
                  Try the classifier
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
