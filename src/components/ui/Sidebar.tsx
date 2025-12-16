"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { m, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileBarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet,
  TrendingUp,
  Users,
  CreditCard,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileBarChart,
  },
  {
    title: "Transactions",
    href: "/dashboard",
    icon: CreditCard,
  },
  {
    title: "Analytics",
    href: "/reports",
    icon: TrendingUp,
  },
];

const secondaryNavItems = [
  {
    title: "Team",
    href: "/settings",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/dashboard",
    icon: HelpCircle,
  },
];

export function Sidebar({
  isCollapsed,
  onToggle,
  isMobile,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  const sidebarVariants = {
    expanded: { width: isMobile ? "280px" : "256px" },
    collapsed: { width: "80px" },
  };

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <m.aside
      initial={false}
      animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col",
        "transition-colors duration-300",
        isMobile ? "fixed left-0 top-0 z-50 shadow-2xl" : "relative"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
          onClick={handleNavClick}
        >
          <div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent 
                          flex items-center justify-center shadow-lg glow-blue-subtle"
          >
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence mode="wait">
            {(!isCollapsed || isMobile) && (
              <m.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-xl bg-gradient-to-r from-primary to-accent 
                           bg-clip-text text-transparent"
              >
                BluLedger
              </m.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="mb-4">
          <AnimatePresence mode="wait">
            {(!isCollapsed || isMobile) && (
              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"
              >
                Main Menu
              </m.p>
            )}
          </AnimatePresence>
          {mainNavItems.map((item) => (
            <NavItem
              key={item.href + item.title}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed && !isMobile}
              onClick={handleNavClick}
            />
          ))}
        </div>

        <div className="pt-4 border-t border-sidebar-border">
          <AnimatePresence mode="wait">
            {(!isCollapsed || isMobile) && (
              <m.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2"
              >
                Settings
              </m.p>
            )}
          </AnimatePresence>
          {secondaryNavItems.map((item) => (
            <NavItem
              key={item.href + item.title}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed && !isMobile}
              onClick={handleNavClick}
            />
          ))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
            "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
            "transition-all duration-200",
            isCollapsed && !isMobile && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5" />
          <AnimatePresence mode="wait">
            {(!isCollapsed || isMobile) && (
              <m.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-medium"
              >
                Log out
              </m.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Collapse Toggle - Desktop Only */}
      {!isMobile && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full 
                     bg-sidebar border border-sidebar-border shadow-md
                     flex items-center justify-center
                     hover:bg-secondary transition-colors duration-200"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      )}
    </m.aside>
  );
}

interface NavItemProps {
  item: {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

function NavItem({ item, isActive, isCollapsed, onClick }: NavItemProps) {
  const Icon = item.icon;

  return (
    <Link href={item.href} onClick={onClick}>
      <m.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer",
          "transition-all duration-200",
          isActive
            ? "bg-primary/10 text-primary border border-primary/20"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
          isCollapsed && "justify-center"
        )}
      >
        <Icon
          className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")}
        />
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <m.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className={cn("font-medium", isActive && "text-primary")}
            >
              {item.title}
            </m.span>
          )}
        </AnimatePresence>
        {isActive && !isCollapsed && (
          <m.div
            layoutId="activeIndicator"
            className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
          />
        )}
      </m.div>
    </Link>
  );
}
