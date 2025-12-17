"use client";

import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { X } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import type { TransactionType } from "@/types/api";

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultType?: TransactionType;
  defaultAccountId?: string;
}

export function CreateTransactionModal({
  isOpen,
  onClose,
  onSuccess,
  defaultType = "EXPENSE",
  defaultAccountId,
}: CreateTransactionModalProps) {
  const { createTransaction } = useTransactions();
  const { accounts } = useAccounts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactionType, setTransactionType] =
    useState<TransactionType>(defaultType);

  const activeAccounts = accounts.filter((acc) => acc.isActive);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const amount = parseFloat(formData.get("amount") as string);

      if (amount <= 0) {
        throw new Error("Amount must be greater than zero");
      }

      await createTransaction({
        type: formData.get("type") as TransactionType,
        amount,
        currency: (formData.get("currency") as string) || "USD",
        description: (formData.get("description") as string) || undefined,
        category: (formData.get("category") as string) || undefined,
        date: (formData.get("date") as string) || new Date().toISOString(),
        fromAccountId: (formData.get("fromAccountId") as string) || undefined,
        toAccountId: (formData.get("toAccountId") as string) || undefined,
      });

      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create transaction"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (activeAccounts.length === 0) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6"
              >
                <h2 className="text-xl font-semibold mb-4">
                  No Accounts Available
                </h2>
                <p className="text-muted-foreground mb-6">
                  You need to create at least one account before recording
                  transactions.
                </p>
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
              </m.div>
            </div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <m.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold">New Transaction</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-4 overflow-y-auto"
              >
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Transaction Type <span className="text-destructive">*</span>
                  </label>
                  <select
                    name="type"
                    required
                    value={transactionType}
                    onChange={(e) =>
                      setTransactionType(e.target.value as TransactionType)
                    }
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  >
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                    <option value="TRANSFER">Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>

                {transactionType === "EXPENSE" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      From Account <span className="text-destructive">*</span>
                    </label>
                    <select
                      name="fromAccountId"
                      required
                      defaultValue={defaultAccountId}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background
                               focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      <option value="">Select account...</option>
                      {activeAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name} ({account.currency} {account.balance})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {transactionType === "INCOME" && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      To Account <span className="text-destructive">*</span>
                    </label>
                    <select
                      name="toAccountId"
                      required
                      defaultValue={defaultAccountId}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background
                               focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    >
                      <option value="">Select account...</option>
                      {activeAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name} ({account.currency} {account.balance})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {transactionType === "TRANSFER" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        From Account <span className="text-destructive">*</span>
                      </label>
                      <select
                        name="fromAccountId"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background
                                 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      >
                        <option value="">Select account...</option>
                        {activeAccounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.name} ({account.currency} {account.balance}
                            )
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        To Account <span className="text-destructive">*</span>
                      </label>
                      <select
                        name="toAccountId"
                        required
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background
                                 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      >
                        <option value="">Select account...</option>
                        {activeAccounts.map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.name} ({account.currency} {account.balance}
                            )
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    placeholder="e.g., Groceries, Salary"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={2}
                    placeholder="Add notes..."
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background
                             focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  />
                </div>

                <input type="hidden" name="currency" value="USD" />

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creating..." : "Create Transaction"}
                  </button>
                </div>
              </form>
            </m.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
