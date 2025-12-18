"use client";

import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { X } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { Input, Select, SelectItem, Textarea, Button, DatePicker } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import type { TransactionType } from "@/types/api";

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultType?: TransactionType;
  defaultAccountId?: string;
}

const transactionTypes = [
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expense" },
  { value: "TRANSFER", label: "Transfer" },
];

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

  const [amount, setAmount] = useState("");
  const [fromAccountId, setFromAccountId] = useState(defaultAccountId || "");
  const [toAccountId, setToAccountId] = useState(defaultAccountId || "");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dateValue, setDateValue] = useState(parseDate(new Date().toISOString().split("T")[0]));

  const activeAccounts = accounts.filter((acc) => acc.isActive);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const amountNum = parseFloat(amount);

      if (amountNum <= 0) {
        throw new Error("Amount must be greater than zero");
      }

      await createTransaction({
        type: transactionType,
        amount: amountNum,
        currency: "USD",
        description: description || undefined,
        category: category || undefined,
        date: date || new Date().toISOString(),
        fromAccountId: fromAccountId || undefined,
        toAccountId: toAccountId || undefined,
      });

      onSuccess?.();
      onClose();
      // Reset form
      setAmount("");
      setFromAccountId("");
      setToAccountId("");
      setCategory("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
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
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <m.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 pointer-events-auto"
              >
                <h2 className="text-xl font-semibold mb-4">
                  No Accounts Available
                </h2>
                <p className="text-muted-foreground mb-6">
                  You need to create at least one account before recording
                  transactions.
                </p>
                <Button onPress={onClose} color="primary" className="w-full">
                  Close
                </Button>
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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <m.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
                <h2 className="text-xl font-semibold">New Transaction</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  type="button"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

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

                <Select
                  label="Transaction Type"
                  variant="bordered"
                  selectedKeys={[transactionType]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as TransactionType;
                    setTransactionType(selected);
                  }}
                  isRequired
                >
                  {transactionTypes.map((type) => (
                    <SelectItem key={type.value}>{type.label}</SelectItem>
                  ))}
                </Select>

                <Input
                  type="number"
                  label="Amount"
                  variant="bordered"
                  placeholder="0.00"
                  value={amount}
                  onValueChange={setAmount}
                  isRequired
                  min="0.01"
                  step="0.01"
                />

                {transactionType === "EXPENSE" && (
                  <Select
                    label="From Account"
                    variant="bordered"
                    placeholder="Select account..."
                    selectedKeys={fromAccountId ? [fromAccountId] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setFromAccountId(selected);
                    }}
                    isRequired
                  >
                    {activeAccounts.map((account) => (
                      <SelectItem key={account.id}>
                        {account.name} ({account.currency} {account.balance})
                      </SelectItem>
                    ))}
                  </Select>
                )}

                {transactionType === "INCOME" && (
                  <Select
                    label="To Account"
                    variant="bordered"
                    placeholder="Select account..."
                    selectedKeys={toAccountId ? [toAccountId] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setToAccountId(selected);
                    }}
                    isRequired
                  >
                    {activeAccounts.map((account) => (
                      <SelectItem key={account.id}>
                        {account.name} ({account.currency} {account.balance})
                      </SelectItem>
                    ))}
                  </Select>
                )}

                {transactionType === "TRANSFER" && (
                  <>
                    <Select
                      label="From Account"
                      variant="bordered"
                      placeholder="Select account..."
                      selectedKeys={fromAccountId ? [fromAccountId] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setFromAccountId(selected);
                      }}
                      isRequired
                    >
                      {activeAccounts.map((account) => (
                        <SelectItem key={account.id}>
                          {account.name} ({account.currency} {account.balance})
                        </SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="To Account"
                      variant="bordered"
                      placeholder="Select account..."
                      selectedKeys={toAccountId ? [toAccountId] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setToAccountId(selected);
                      }}
                      isRequired
                    >
                      {activeAccounts.map((account) => (
                        <SelectItem key={account.id}>
                          {account.name} ({account.currency} {account.balance})
                        </SelectItem>
                      ))}
                    </Select>
                  </>
                )}

                <Input
                  label="Category"
                  variant="bordered"
                  placeholder="e.g., Groceries, Salary"
                  value={category}
                  onValueChange={setCategory}
                  description="Optional"
                />

                <Textarea
                  label="Description"
                  variant="bordered"
                  placeholder="Add notes..."
                  value={description}
                  onValueChange={setDescription}
                  minRows={2}
                  maxRows={4}
                  description="Optional"
                />

                <DatePicker
                  label="Transaction Date"
                  variant="bordered"
                  value={dateValue}
                  onChange={(value) => {
                    setDateValue(value);
                    setDate(`${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`);
                  }}
                  showMonthAndYearPickers
                  classNames={{
                    base: "w-full",
                    input: "text-sm",
                  }}
                />

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
                    Create Transaction
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
