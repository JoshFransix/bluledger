"use client";

import { useState, useEffect } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { useOrganizations } from "@/hooks/useOrganizations";
import { X, Edit2, Trash2, Calendar, DollarSign, FileText } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Textarea,
  Tabs,
  Tab,
} from "@heroui/react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ViewEditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
}

export function ViewEditTransactionModal({
  isOpen,
  onClose,
  transaction: initialTransaction,
}: ViewEditTransactionModalProps) {
  const { updateTransaction, deleteTransaction } = useTransactions();
  const { accounts } = useAccounts();
  const { currentOrg } = useOrganizations();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user can edit (admin or member, not viewer)
  const canEdit = currentOrg?.role !== "viewer";

  // Form state
  const [type, setType] = useState(initialTransaction?.type || "EXPENSE");
  const [amount, setAmount] = useState(
    initialTransaction?.amount?.toString() || ""
  );
  const [description, setDescription] = useState(
    initialTransaction?.description || ""
  );
  const [category, setCategory] = useState(initialTransaction?.category || "");
  const [date, setDate] = useState(
    initialTransaction?.date
      ? new Date(initialTransaction.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [fromAccountId, setFromAccountId] = useState(
    initialTransaction?.fromAccountId || ""
  );
  const [toAccountId, setToAccountId] = useState(
    initialTransaction?.toAccountId || ""
  );

  useEffect(() => {
    if (initialTransaction) {
      setType(initialTransaction.type);
      setAmount(initialTransaction.amount?.toString() || "");
      setDescription(initialTransaction.description || "");
      setCategory(initialTransaction.category || "");
      setDate(
        initialTransaction.date
          ? new Date(initialTransaction.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      );
      setFromAccountId(initialTransaction.fromAccountId || "");
      setToAccountId(initialTransaction.toAccountId || "");
    }
  }, [initialTransaction]);

  // Reset editing state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setError(null);
    }
  }, [isOpen]);

  const transactionTypes = [
    { value: "INCOME", label: "Income" },
    { value: "EXPENSE", label: "Expense" },
    { value: "TRANSFER", label: "Transfer" },
  ];

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const updateData: any = {
        type,
        amount: parseFloat(amount),
        description: description.trim() || undefined,
        category: category.trim() || undefined,
        date: new Date(date).toISOString(),
      };

      if (type === "EXPENSE" || type === "TRANSFER") {
        updateData.fromAccountId = fromAccountId || undefined;
      }
      if (type === "INCOME" || type === "TRANSFER") {
        updateData.toAccountId = toAccountId || undefined;
      }

      await updateTransaction({
        id: initialTransaction.id,
        data: updateData,
      });

      setIsEditing(false);
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update transaction"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    setIsDeleting(true);
    try {
      await deleteTransaction(initialTransaction.id);
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete transaction"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const getAccountName = (accountId: string) => {
    return accounts.find((acc: any) => acc.id === accountId)?.name || "Unknown";
  };

  return (
    <AnimatePresence>
      {isOpen && initialTransaction && (
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
              className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold">
                  {isEditing ? "Edit Transaction" : "Transaction Details"}
                </h2>
                <div className="flex items-center gap-2">
                  {!isEditing && canEdit && (
                    <>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        onPress={() => setIsEditing(true)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={handleDelete}
                        isLoading={isDeleting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                    disabled={isSubmitting}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4">
                    {error}
                  </div>
                )}

                {isEditing ? (
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <Select
                      label="Transaction Type"
                      variant="bordered"
                      selectedKeys={new Set([type])}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setType(selected);
                      }}
                      isRequired
                    >
                      {transactionTypes.map((t) => (
                        <SelectItem key={t.value} textValue={t.label}>
                          {t.label}
                        </SelectItem>
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
                      startContent={
                        <DollarSign className="w-4 h-4 text-default-400" />
                      }
                    />

                    <Input
                      type="date"
                      label="Date"
                      variant="bordered"
                      value={date}
                      onValueChange={setDate}
                      isRequired
                      startContent={
                        <Calendar className="w-4 h-4 text-default-400" />
                      }
                    />

                    {(type === "EXPENSE" || type === "TRANSFER") && (
                      <Select
                        label="From Account"
                        variant="bordered"
                        placeholder="Select account"
                        selectedKeys={
                          fromAccountId ? new Set([fromAccountId]) : new Set()
                        }
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          setFromAccountId(selected);
                        }}
                        isRequired={type === "EXPENSE" || type === "TRANSFER"}
                        disallowEmptySelection
                      >
                        {accounts.map((account: any) => (
                          <SelectItem key={account.id} textValue={account.name}>
                            <div>
                              <p className="font-medium">{account.name}</p>
                              <p className="text-xs text-default-400">
                                {account.type} •{" "}
                                {formatCurrency(parseFloat(account.balance))}
                              </p>
                            </div>
                          </SelectItem>
                        ))}
                      </Select>
                    )}

                    {(type === "INCOME" || type === "TRANSFER") && (
                      <Select
                        label="To Account"
                        variant="bordered"
                        placeholder="Select account"
                        selectedKeys={
                          toAccountId ? new Set([toAccountId]) : new Set()
                        }
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as string;
                          setToAccountId(selected);
                        }}
                        isRequired={type === "INCOME" || type === "TRANSFER"}
                        disallowEmptySelection
                      >
                        {accounts.map((account: any) => (
                          <SelectItem key={account.id} textValue={account.name}>
                            <div>
                              <p className="font-medium">{account.name}</p>
                              <p className="text-xs text-default-400">
                                {account.type} •{" "}
                                {formatCurrency(parseFloat(account.balance))}
                              </p>
                            </div>
                          </SelectItem>
                        ))}
                      </Select>
                    )}

                    <Input
                      type="text"
                      label="Category"
                      variant="bordered"
                      placeholder="e.g., Food, Salary, etc."
                      value={category}
                      onValueChange={setCategory}
                    />

                    <Textarea
                      label="Description"
                      variant="bordered"
                      placeholder="Enter transaction description"
                      value={description}
                      onValueChange={setDescription}
                      minRows={3}
                      startContent={
                        <FileText className="w-4 h-4 text-default-400 mt-2" />
                      }
                    />

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="bordered"
                        onPress={() => setIsEditing(false)}
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
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    {/* Transaction Type Badge */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          type === "INCOME"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : type === "EXPENSE"
                            ? "bg-rose-500/10 text-rose-600"
                            : "bg-blue-500/10 text-blue-600"
                        }`}
                      >
                        {type}
                      </span>
                      <span className="text-2xl font-bold">
                        {formatCurrency(parseFloat(initialTransaction.amount))}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Date
                        </p>
                        <p className="font-medium">
                          {formatDate(new Date(initialTransaction.date))}
                        </p>
                      </div>

                      {initialTransaction.category && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Category
                          </p>
                          <p className="font-medium">
                            {initialTransaction.category}
                          </p>
                        </div>
                      )}

                      {initialTransaction.fromAccountId && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            From Account
                          </p>
                          <p className="font-medium">
                            {getAccountName(initialTransaction.fromAccountId)}
                          </p>
                        </div>
                      )}

                      {initialTransaction.toAccountId && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            To Account
                          </p>
                          <p className="font-medium">
                            {getAccountName(initialTransaction.toAccountId)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {initialTransaction.description && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Description
                        </p>
                        <p className="text-sm bg-secondary/50 p-3 rounded-lg">
                          {initialTransaction.description}
                        </p>
                      </div>
                    )}

                    {/* Tags */}
                    {initialTransaction.tags &&
                      initialTransaction.tags.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Tags
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {initialTransaction.tags.map(
                              (tag: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                                >
                                  {tag}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </m.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
