"use client";

import { useState, useMemo } from "react";
import { m, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  Check,
  AlertCircle,
  Info,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { useAccounts } from "@/hooks/useAccounts";
import { formatCurrency, formatDate } from "@/lib/utils";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: "transaction" | "account" | "alert" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon: React.ReactNode;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { transactions } = useTransactions();
  const { accounts } = useAccounts();
  const [readNotifications, setReadNotifications] = useState<Set<string>>(
    new Set()
  );

  // Generate notifications from transactions and accounts
  const notifications = useMemo(() => {
    const notifs: Notification[] = [];

    // Recent transactions (last 5)
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    recentTransactions.forEach((txn) => {
      const timeDiff = Date.now() - new Date(txn.date).getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);

      // Only show transactions from last 24 hours
      if (hoursDiff < 24) {
        notifs.push({
          id: `txn-${txn.id}`,
          type: "transaction",
          title:
            txn.type === "INCOME"
              ? "Income Received"
              : txn.type === "EXPENSE"
              ? "Expense Recorded"
              : "Transfer Completed",
          message: `${txn.description || "Transaction"} - ${formatCurrency(
            parseFloat(txn.amount)
          )}`,
          timestamp: new Date(txn.date),
          read: readNotifications.has(`txn-${txn.id}`),
          icon: <TrendingUp className="w-4 h-4" />,
        });
      }
    });

    // Low balance alerts
    accounts.forEach((account) => {
      const balance = parseFloat(account.balance);
      if (balance < 1000 && account.isActive) {
        notifs.push({
          id: `alert-${account.id}`,
          type: "alert",
          title: "Low Balance Alert",
          message: `${account.name} has a low balance: ${formatCurrency(
            balance
          )}`,
          timestamp: new Date(),
          read: readNotifications.has(`alert-${account.id}`),
          icon: <AlertCircle className="w-4 h-4" />,
        });
      }
    });

    // Sort by timestamp
    return notifs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [transactions, accounts, readNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setReadNotifications((prev) => new Set([...prev, id]));
  };

  const markAllAsRead = () => {
    setReadNotifications(new Set(notifications.map((n) => n.id)));
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
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Panel */}
          <m.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <h2 className="font-semibold text-lg">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Bell className="w-16 h-16 text-muted-foreground opacity-50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No notifications yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You'll see updates about your transactions here
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {notifications.map((notification, index) => (
                    <m.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        notification.read
                          ? "hover:bg-secondary/50"
                          : "bg-primary/5 hover:bg-primary/10"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            notification.type === "transaction"
                              ? "bg-primary/10 text-primary"
                              : notification.type === "alert"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {notification.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-medium text-sm">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {formatDate(notification.timestamp.toISOString())}
                          </div>
                        </div>
                      </div>
                    </m.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-border bg-secondary/30">
                <p className="text-xs text-center text-muted-foreground">
                  Showing recent activity from your accounts
                </p>
              </div>
            )}
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
