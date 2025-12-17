"use client";

import { useState } from "react";
import { useAccounts } from "@/hooks/useAccounts";
import { X } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { Input, Select, SelectItem, Textarea, Button } from "@heroui/react";
import type { AccountType } from "@/types/api";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const accountTypes = [
  { value: "ASSET", label: "Asset (Cash, Bank, Receivables)" },
  { value: "LIABILITY", label: "Liability (Loans, Payables)" },
  { value: "EQUITY", label: "Equity (Owner's Capital)" },
  { value: "REVENUE", label: "Revenue (Income Accounts)" },
  { value: "EXPENSE", label: "Expense (Cost Accounts)" },
];

const currencies = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "JPY", label: "JPY (¥)" },
];

export function CreateAccountModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateAccountModalProps) {
  const { createAccount } = useAccounts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType | "">("");
  const [currency, setCurrency] = useState("USD");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await createAccount({
        name,
        type: type as AccountType,
        currency,
        description: description || undefined,
      });

      onSuccess?.();
      onClose();
      // Reset form
      setName("");
      setType("");
      setCurrency("USD");
      setDescription("");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Failed to create account");
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
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
                <h2 className="text-xl font-semibold">Create New Account</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5 overflow-y-auto flex-1"
              >
                {error && (
                  <m.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm break-words"
                  >
                    {error}
                  </m.div>
                )}

                <Input
                  label="Account Name"
                  variant="bordered"
                  placeholder="e.g., Cash Account, Savings"
                  value={name}
                  onValueChange={setName}
                  isRequired
                  minLength={2}
                  maxLength={100}
                />

                <Select
                  label="Account Type"
                  variant="bordered"
                  placeholder="Select type..."
                  selectedKeys={type ? [type] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as AccountType;
                    setType(selected);
                  }}
                  isRequired
                >
                  {accountTypes.map((type) => (
                    <SelectItem key={type.value}>{type.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="Currency"
                  variant="bordered"
                  selectedKeys={[currency]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setCurrency(selected);
                  }}
                >
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value}>{curr.label}</SelectItem>
                  ))}
                </Select>

                <Textarea
                  label="Description"
                  variant="bordered"
                  placeholder="Add notes about this account..."
                  value={description}
                  onValueChange={setDescription}
                  minRows={3}
                  maxRows={5}
                  description="Optional"
                />

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="bordered"
                    onPress={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    isLoading={isSubmitting}
                    className="flex-1"
                  >
                    Create Account
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
