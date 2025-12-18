"use client";

import { useEffect, useState } from "react";
import { m, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

export function OrgAccessLostBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleAccessLoss = () => {
      setShowBanner(true);
      // Auto-hide after 5 seconds
      const timeout = setTimeout(() => setShowBanner(false), 5000);
      return () => clearTimeout(timeout);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("orgAccessLost", handleAccessLoss);
      return () => window.removeEventListener("orgAccessLost", handleAccessLoss);
    }
  }, []);

  return (
    <AnimatePresence>
      {showBanner && (
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md"
        >
          <div className="bg-amber-500/90 backdrop-blur-sm border border-amber-600 rounded-lg p-4 flex items-center gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-amber-900 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-amber-900">
                Organization access lost
              </p>
              <p className="text-sm text-amber-800">
                You no longer have access to that organization. Switched to another one.
              </p>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
