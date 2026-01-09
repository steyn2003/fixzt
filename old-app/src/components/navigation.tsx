"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Diensten" },
    { href: "/about", label: "Over Ons" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full bg-white shadow-sm"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="relative h-16 w-52"
          >
            <Image
              src="/logo.png"
              alt="Fixzt Logo"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </Link>

        <nav className="flex items-center space-x-6">
          {links.map((link, index) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors relative z-10",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-primary",
                )}
              >
                {link.label}
              </Link>
              {(pathname === link.href || hoveredIndex === index) && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
            </div>
          ))}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="sm">Contact</Button>
          </motion.div>
        </nav>
      </div>
    </motion.header>
  );
}
