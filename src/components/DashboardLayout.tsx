"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/ui/Sidebar";
import { Navbar } from "@/components/ui/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { X } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar - Fixed */}
        <div className="hidden lg:block">
          <Sidebar
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              <m.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed left-0 top-0 z-50 lg:hidden"
              >
                <Sidebar
                  isCollapsed={false}
                  onToggle={() => {}}
                  isMobile
                  onClose={() => setMobileMenuOpen(false)}
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg 
                             bg-secondary hover:bg-secondary/80 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </m.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content - With padding for fixed sidebar */}
        <div
          className={`flex flex-col h-screen transition-all duration-300 ${
            sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
          }`}
        >
          <Navbar onMenuClick={() => setMobileMenuOpen(true)} title={title} />
          <m.main
            layout
            className="flex-1 p-4 lg:p-6 xl:p-8 overflow-y-auto overflow-x-hidden"
          >
            {children}
          </m.main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
