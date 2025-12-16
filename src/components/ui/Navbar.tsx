"use client";

import { m } from "framer-motion";
import { Menu, Bell, Search, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onMenuClick: () => void;
  title?: string;
}

export function Navbar({ onMenuClick, title = "Dashboard" }: NavbarProps) {
  return (
    <m.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-16 bg-card/80 backdrop-blur-xl border-b border-border 
                 flex items-center justify-between px-4 lg:px-6
                 sticky top-0 z-40 transition-colors duration-300"
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-xl font-semibold hidden sm:block">{title}</h1>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions, reports..."
            className={cn(
              "w-full h-10 pl-10 pr-4 rounded-lg",
              "bg-secondary/50 border border-border",
              "text-sm placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
              "transition-all duration-200"
            )}
          />
          <kbd
            className="absolute right-3 top-1/2 -translate-y-1/2 
                          px-2 py-0.5 rounded text-xs font-mono
                          bg-muted text-muted-foreground hidden lg:inline-block"
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <m.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </m.button>

        <ThemeToggle />

        <m.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="ml-2 flex items-center gap-2 p-1.5 pr-3 rounded-lg 
                     hover:bg-secondary transition-colors"
        >
          <div
            className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent
                          flex items-center justify-center"
          >
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium text-sm hidden lg:block">John Doe</span>
        </m.button>
      </div>
    </m.header>
  );
}
