"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { PageTransition } from "@/components/PageTransition";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { CreateTransactionModal } from "@/components/modals/CreateTransactionModal";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Search,
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { m } from "framer-motion";
import { Input, Button, Chip } from "@heroui/react";

export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const { accounts, isLoading: accountsLoading } = useAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<
    "ALL" | "INCOME" | "EXPENSE" | "TRANSFER"
  >("ALL");
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  // Handle URL params for account filtering
  useEffect(() => {
    const accountIdFromUrl = searchParams.get("accountId");
    if (
      accountIdFromUrl &&
      accounts.some((acc) => acc.id === accountIdFromUrl)
    ) {
      setSelectedAccountId(accountIdFromUrl);
    }
  }, [searchParams, accounts]);

  const selectedAccount = useMemo(() => {
    return accounts.find((acc) => acc.id === selectedAccountId);
  }, [accounts, selectedAccountId]);

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by account
    if (selectedAccountId) {
      filtered = filtered.filter(
        (t) =>
          t.fromAccountId === selectedAccountId ||
          t.toAccountId === selectedAccountId
      );
    }

    // Filter by type
    if (filterType !== "ALL") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions, selectedAccountId, filterType, searchQuery]);

  const handleExport = () => {
    // Export filtered transactions as CSV
    const headers = [
      "Date",
      "Description",
      "Type",
      "Category",
      "Amount",
      "Account",
    ];
    const csvData = filteredTransactions.map((t) => {
      const account = selectedAccount?.name || "Multiple";
      return [
        new Date(t.date).toLocaleDateString(),
        t.description || "",
        t.type,
        t.category || "",
        t.amount,
        account,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${selectedAccount?.name || "all"}-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const isLoading = transactionsLoading || accountsLoading;

  return (
    <DashboardLayout title="Transactions">
      <PageTransition>
        <PageHeader
          title="Transactions"
          description="Track and manage all your financial transactions"
        >
          <Button
            startContent={<Plus className="w-4 h-4" />}
            color="primary"
            onPress={() => setIsTransactionModalOpen(true)}
          >
            New Transaction
          </Button>
        </PageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Accounts */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {accountsLoading ? (
                  [...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 bg-secondary/50 rounded-lg animate-pulse"
                    />
                  ))
                ) : accounts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground mb-3">
                      No accounts yet
                    </p>
                    <button
                      onClick={() => {
                        // Redirect to dashboard where account creation is
                        window.location.href = "/dashboard";
                      }}
                      className="text-sm text-primary hover:underline"
                    >
                      Create Account
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setSelectedAccountId(null)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg transition-colors",
                        !selectedAccountId
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-secondary/50"
                      )}
                    >
                      <p className="text-sm font-medium">All Accounts</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(
                          accounts.reduce(
                            (sum, acc) => sum + parseFloat(acc.balance),
                            0
                          )
                        )}
                      </p>
                    </button>
                    {accounts.map((account) => (
                      <button
                        key={account.id}
                        onClick={() => setSelectedAccountId(account.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg transition-colors",
                          selectedAccountId === account.id
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-secondary/50"
                        )}
                      >
                        <p className="text-sm font-medium truncate">
                          {account.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(parseFloat(account.balance))}{" "}
                          {account.currency}
                        </p>
                      </button>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Transactions */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <m.div
                  key={selectedAccountId || "all"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <CardTitle>
                      {selectedAccount
                        ? selectedAccount.name
                        : "All Transactions"}
                    </CardTitle>
                    {selectedAccount && (
                      <m.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-muted-foreground mt-1"
                      >
                        Balance:{" "}
                        {formatCurrency(parseFloat(selectedAccount.balance))}{" "}
                        {selectedAccount.currency}
                      </m.p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExport}
                      disabled={filteredTransactions.length === 0}
                      className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </m.div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                    startContent={
                      <Search className="w-4 h-4 text-default-400" />
                    }
                    variant="bordered"
                    classNames={{
                      base: "flex-1",
                      input: "text-sm",
                    }}
                  />
                  <div className="flex gap-2 flex-wrap">
                    {(["ALL", "INCOME", "EXPENSE", "TRANSFER"] as const).map(
                      (type) => (
                        <Chip
                          key={type}
                          onClick={() => setFilterType(type)}
                          variant={filterType === type ? "solid" : "bordered"}
                          color={filterType === type ? "primary" : "default"}
                          className="cursor-pointer"
                        >
                          {type === "ALL"
                            ? "All"
                            : type.charAt(0) + type.slice(1).toLowerCase()}
                        </Chip>
                      )
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="h-20 bg-secondary/50 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                      <ArrowLeftRight className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium mb-2">
                      No transactions found
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {searchQuery || filterType !== "ALL" || selectedAccountId
                        ? "Try adjusting your filters"
                        : "Create your first transaction to get started"}
                    </p>
                    <button
                      onClick={() => setIsTransactionModalOpen(true)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      New Transaction
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredTransactions.map((transaction, index) => (
                      <m.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                            transaction.type === "INCOME" &&
                              "bg-emerald-500/10",
                            transaction.type === "EXPENSE" && "bg-rose-500/10",
                            transaction.type === "TRANSFER" && "bg-blue-500/10"
                          )}
                        >
                          {transaction.type === "INCOME" && (
                            <ArrowDownLeft className="w-5 h-5 text-emerald-500" />
                          )}
                          {transaction.type === "EXPENSE" && (
                            <ArrowUpRight className="w-5 h-5 text-rose-500" />
                          )}
                          {transaction.type === "TRANSFER" && (
                            <ArrowLeftRight className="w-5 h-5 text-blue-500" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {transaction.description || "Untitled Transaction"}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {transaction.category && (
                              <span className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                                {transaction.category}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatDate(transaction.date)}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p
                            className={cn(
                              "font-semibold",
                              transaction.type === "INCOME" &&
                                "text-emerald-500",
                              transaction.type === "EXPENSE" && "text-rose-500",
                              transaction.type === "TRANSFER" && "text-blue-500"
                            )}
                          >
                            {transaction.type === "INCOME" && "+"}
                            {transaction.type === "EXPENSE" && "-"}
                            {formatCurrency(parseFloat(transaction.amount))}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.currency}
                          </p>
                        </div>
                      </m.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <CreateTransactionModal
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          defaultAccountId={selectedAccountId || undefined}
        />
      </PageTransition>
    </DashboardLayout>
  );
}
