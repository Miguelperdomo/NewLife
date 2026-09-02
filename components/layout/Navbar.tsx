"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { navLinks } from "@/data/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link href="/" onClick={() => setOpen(false)} aria-label="Ir al inicio">
          <Logo variant="dark" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="/ministerios" variant="primary" className="px-5 py-2.5 text-xs">
            Quiero ser parte
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-700 md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      <div className={cn("md:hidden", open ? "block" : "hidden")}>
        <Container className="flex flex-col gap-1 border-t border-slate-100 pb-4 pt-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-brand-50"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Button
            href="/ministerios"
            variant="primary"
            className="mt-2 justify-center"
            onClick={() => setOpen(false)}
          >
            Quiero ser parte
          </Button>
        </Container>
      </div>
    </header>
  );
}
