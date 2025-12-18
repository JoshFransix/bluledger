"use client";

import { useState } from "react";
import { useOrganizations } from "@/hooks/useOrganizations";
import { X } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { Input, Button } from "@heroui/react";

interface CreateOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateOrganizationModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateOrganizationModalProps) {
  const { createOrganization } = useOrganizations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!name.trim()) {
        throw new Error("Organization name is required");
      }

      await createOrganization({ name: name.trim() });

      onSuccess?.();
      onClose();
      setName("");
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create organization";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <m.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
                mass: 0.8,
              }}
              className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold">Create Organization</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <Input
                  type="text"
                  label="Organization Name"
                  variant="bordered"
                  placeholder="Enter organization name"
                  value={name}
                  onValueChange={setName}
                  isRequired
                  autoFocus
                  description="Choose a unique name for your organization"
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="bordered"
                    onPress={onClose}
                    className="flex-1"
                    isDisabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    isLoading={isSubmitting}
                    className="flex-1"
                  >
                    Create Organization
                  </Button>
                </div>
              </form>
            </m.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
