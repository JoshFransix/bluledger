"use client";

import { m } from "framer-motion";
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  Settings as SettingsIcon,
  Calendar,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchModal } from "./SearchModal";
import { NotificationPanel } from "./NotificationPanel";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Avatar,
  User as HeroUser,
} from "@heroui/react";

interface NavbarProps {
  onMenuClick: () => void;
  title?: string;
}

export function Navbar({ onMenuClick, title = "Dashboard" }: NavbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Clear local state even if API call fails
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentOrgId");
      }
      router.push("/login");
    }
  };

  // Handle keyboard shortcut for search (Cmd/Ctrl + K)
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  });

  return (
    <>
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
          <button onClick={() => setShowSearch(true)} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search transactions, reports..."
                readOnly
                className={cn(
                  "w-full h-10 pl-10 pr-4 rounded-lg cursor-pointer",
                  "bg-secondary/50 border border-border",
                  "text-sm placeholder:text-muted-foreground",
                  "hover:border-primary/50 transition-all duration-200"
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
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <m.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(true)}
            className="relative p-2.5 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </m.button>

          <ThemeToggle />

          <Dropdown
            placement="bottom-end"
            classNames={{
              base: "before:bg-background",
              content: "bg-card border border-border shadow-2xl min-w-[240px]",
            }}
          >
            <DropdownTrigger>
              <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-2 flex items-center gap-2 p-1.5 pr-3 rounded-lg 
                         hover:bg-secondary transition-colors outline-none"
              >
                <Avatar
                  icon={<User className="w-4 h-4" />}
                  classNames={{
                    base: "bg-linear-to-br from-primary to-accent",
                    icon: "text-white",
                  }}
                  size="sm"
                />
                <span className="font-medium text-sm hidden lg:block">
                  {user?.name || user?.email?.split("@")[0] || "User"}
                </span>
              </m.button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="User menu actions"
              variant="flat"
              classNames={{
                base: "p-0",
                list: "p-0",
              }}
            >
              <DropdownSection showDivider classNames={{ base: "mb-0" }}>
                <DropdownItem
                  key="profile"
                  isReadOnly
                  className="h-14 gap-2 opacity-100 cursor-default hover:bg-transparent!"
                  classNames={{
                    base: "data-[hover=true]:bg-transparent",
                  }}
                >
                  <HeroUser
                    name={user?.name || "User"}
                    description={user?.email}
                    classNames={{
                      name: "text-sm font-semibold",
                      description: "text-xs text-muted-foreground",
                    }}
                    avatarProps={{
                      size: "sm",
                      icon: <User className="w-4 h-4" />,
                      classNames: {
                        base: "bg-linear-to-br from-primary to-accent",
                        icon: "text-white",
                      },
                    }}
                  />
                </DropdownItem>
              </DropdownSection>
              <DropdownSection classNames={{ base: "mb-0" }}>
                <DropdownItem
                  key="settings"
                  startContent={<SettingsIcon className="w-4 h-4" />}
                  onClick={() => router.push("/settings")}
                  className="text-foreground hover:bg-secondary! data-[hover=true]:bg-secondary!"
                >
                  Settings
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  startContent={<LogOut className="w-4 h-4" />}
                  onClick={handleLogout}
                  className="text-danger hover:bg-danger/10! data-[hover=true]:bg-danger/10!"
                  color="danger"
                >
                  Log Out
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </div>
      </m.header>

      {/* Search Modal */}
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
}
