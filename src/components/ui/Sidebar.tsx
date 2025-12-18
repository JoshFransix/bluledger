"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Building2,
  ChevronDown,
  Check,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { CreateOrganizationModal } from "@/components/modals/CreateOrganizationModal";

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
    title: "Transactions",
    href: "/transactions",
    icon: CreditCard,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileBarChart,
  },
];

const secondaryNavItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({
  isCollapsed,
  onToggle,
  isMobile,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { organizations, currentOrg, setCurrentOrg } = useOrganizations();
  const { logout } = useAuth();
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);

  const sidebarVariants = {
    expanded: { width: isMobile ? "280px" : "256px" },
    collapsed: { width: "80px" },
  };

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <m.aside
      initial={false}
      animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
        type: "tween",
      }}
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col",
        "transition-colors duration-300",
        isMobile
          ? "fixed left-0 top-0 z-50 shadow-2xl"
          : "fixed left-0 top-0 z-30"
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
            className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-accent 
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
                className="font-bold text-xl bg-linear-to-r from-primary to-accent 
                           bg-clip-text text-transparent"
              >
                BluLedger
              </m.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Organization Switcher */}
      {(!isCollapsed || isMobile) && organizations.length > 0 && (
        <div className="px-3 py-3 border-b border-sidebar-border">
          {!currentOrg ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 animate-pulse">
              <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-secondary rounded w-20 mb-1"></div>
                <div className="h-3 bg-secondary/50 rounded w-16"></div>
              </div>
            </div>
          ) : organizations.length === 1 ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
              <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {currentOrg.name}
                </p>
                <p className="text-xs text-muted-foreground">Organization</p>
              </div>
            </div>
          ) : (
            <Dropdown
              placement="bottom-start"
              classNames={{
                base: "w-full",
                content: "bg-card border border-border shadow-xl min-w-[200px]",
              }}
            >
              <DropdownTrigger>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors text-left outline-none">
                  <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {currentOrg.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Organization
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Organization selection"
                variant="flat"
                selectionMode="single"
                selectedKeys={currentOrg?.id ? [currentOrg.id] : []}
                onSelectionChange={(keys) => {
                  const selectedId = Array.from(keys)[0] as string;
                  if (selectedId) {
                    setCurrentOrg(selectedId);
                  }
                }}
                classNames={{
                  base: "p-0",
                  list: "p-1",
                }}
              >
                {organizations.map((org: any) => (
                  <DropdownItem
                    key={org.id}
                    textValue={org.name}
                    className="text-foreground hover:bg-secondary! data-[hover=true]:bg-secondary!"
                    endContent={
                      org.id === currentOrg?.id ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : null
                    }
                  >
                    <div>
                      <p className="text-sm font-medium">{org.name}</p>
                    </div>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}

          {/* Create Organization Button */}
          <button
            onClick={() => setIsOrgModalOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2 mt-2 rounded-lg 
                     bg-primary/10 hover:bg-primary/20 transition-colors text-primary text-left"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">New Organization</span>
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto">
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
          <div className="space-y-1">
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
          <div className="space-y-1">
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
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
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

      {/* Organization Modal */}
      <CreateOrganizationModal
        isOpen={isOrgModalOpen}
        onClose={() => setIsOrgModalOpen(false)}
      />
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
        <Icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
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
