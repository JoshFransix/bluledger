"use client";

import { useState, useEffect, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Clock, TrendingUp } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const { transactions } = useTransactions();
  const { accounts } = useAccounts();
  const router = useRouter();

  // Search results
  const results = useMemo(() => {
    if (!query.trim()) return { transactions: [], accounts: [] };

    const searchLower = query.toLowerCase();

    const matchedTransactions = transactions
      .filter(
        (t) =>
          t.description?.toLowerCase().includes(searchLower) ||
          t.category?.toLowerCase().includes(searchLower) ||
          t.amount.toString().includes(searchLower)
      )
      .slice(0, 5);

    const matchedAccounts = accounts
      .filter(
        (a) =>
          a.name.toLowerCase().includes(searchLower) ||
          a.type.toLowerCase().includes(searchLower) ||
          a.description?.toLowerCase().includes(searchLower)
      )
      .slice(0, 5);

    return {
      transactions: matchedTransactions,
      accounts: matchedAccounts,
    };
  }, [query, transactions, accounts]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleTransactionClick = (transactionId: string) => {
    router.push(`/transactions`);
    onClose();
  };

  const handleAccountClick = (accountId: string) => {
    router.push(`/transactions?accountId=${accountId}`);
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <m.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 350,
              mass: 0.8,
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 p-4 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search transactions, accounts, reports..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                />
                <kbd className="px-2 py-1 rounded bg-secondary text-xs font-mono text-muted-foreground">
                  ESC
                </kbd>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto p-2">
                {!query.trim() ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">
                      Start typing to search transactions and accounts
                    </p>
                  </div>
                ) : results.transactions.length === 0 &&
                  results.accounts.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p className="text-sm">No results found for "{query}"</p>
                  </div>
                ) : (
                  <>
                    {/* Accounts Results */}
                    {results.accounts.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                          Accounts
                        </h3>
                        {results.accounts.map((account) => (
                          <button
                            key={account.id}
                            onClick={() => handleAccountClick(account.id)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <TrendingUp className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {account.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {account.type} •{" "}
                                {formatCurrency(parseFloat(account.balance))}
                              </p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Transactions Results */}
                    {results.transactions.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
                          Transactions
                        </h3>
                        {results.transactions.map((transaction) => (
                          <button
                            key={transaction.id}
                            onClick={() =>
                              handleTransactionClick(transaction.id)
                            }
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                transaction.type === "INCOME"
                                  ? "bg-success/10"
                                  : transaction.type === "EXPENSE"
                                  ? "bg-destructive/10"
                                  : "bg-accent/10"
                              }`}
                            >
                              <Clock className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {transaction.description || "Transaction"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {transaction.category} •{" "}
                                {formatDate(transaction.date)}
                              </p>
                            </div>
                            <p
                              className={`text-sm font-semibold flex-shrink-0 ${
                                transaction.type === "INCOME"
                                  ? "text-success"
                                  : transaction.type === "EXPENSE"
                                  ? "text-destructive"
                                  : "text-foreground"
                              }`}
                            >
                              {transaction.type === "INCOME"
                                ? "+"
                                : transaction.type === "EXPENSE"
                                ? "-"
                                : ""}
                              {formatCurrency(parseFloat(transaction.amount))}
                            </p>
                            <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              {query.trim() &&
                (results.transactions.length > 0 ||
                  results.accounts.length > 0) && (
                  <div className="p-3 border-t border-border bg-secondary/30 text-xs text-muted-foreground text-center">
                    Press Enter to view all results
                  </div>
                )}
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
