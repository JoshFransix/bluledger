"use client";

import { DashboardLayout } from "@/components/DashboardLayout";
import { PageTransition } from "@/components/PageTransition";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/Card";
import {
  useOrganizations,
  useOrganizationSummary,
} from "@/hooks/useOrganizations";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { User, Building, Save, Users, TrendingUp, Wallet } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const { currentOrg, currentOrgId, updateOrganization, isUpdating } =
    useOrganizations();
  const { data: summary, isLoading: summaryLoading } =
    useOrganizationSummary(currentOrgId);

  const [orgName, setOrgName] = useState(currentOrg?.name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSaveOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrgId || orgName.trim() === currentOrg?.name) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      await updateOrganization({
        id: currentOrgId,
        data: { name: orgName.trim() },
      });
      setSaveMessage({
        type: "success",
        text: "Organization updated successfully!",
      });
    } catch (error) {
      setSaveMessage({ type: "error", text: "Failed to update organization" });
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <DashboardLayout title="Settings">
      <PageTransition>
        <PageHeader
          title="Settings"
          description="Manage your account and organization settings"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Organization Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Organization Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Organization Settings
                </CardTitle>
                <CardDescription>
                  Update your organization name and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveOrganization} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder={
                        currentOrg?.name || "Enter organization name"
                      }
                      className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                             transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Organization ID
                    </label>
                    <input
                      type="text"
                      value={currentOrgId || ""}
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border
                             text-muted-foreground cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This is your unique organization identifier
                    </p>
                  </div>

                  {saveMessage && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        saveMessage.type === "success"
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600"
                          : "bg-destructive/10 border border-destructive/20 text-destructive"
                      }`}
                    >
                      {saveMessage.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={
                      isSaving ||
                      isUpdating ||
                      orgName.trim() === currentOrg?.name
                    }
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground
                           hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                           font-medium"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Your personal account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border
                           text-muted-foreground cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Contact support to change your email address
                  </p>
                </div>

                {user?.name && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      disabled
                      className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border
                             text-muted-foreground cursor-not-allowed"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <input
                    type="text"
                    value={currentOrg?.role || "Member"}
                    disabled
                    className="w-full px-4 py-2.5 rounded-lg bg-secondary/50 border border-border
                           text-muted-foreground cursor-not-allowed capitalize"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Organization Overview */}
          <div className="space-y-6">
            {summaryLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-16 bg-secondary/50 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : summary ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground font-medium">
                      Organization Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Members
                          </p>
                          <p className="text-lg font-semibold">
                            {summary.membersCount}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Wallet className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Accounts
                          </p>
                          <p className="text-lg font-semibold">
                            {summary.accountsCount}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Transactions
                          </p>
                          <p className="text-lg font-semibold">
                            {summary.transactionsCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-muted-foreground font-medium">
                      Financial Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Total Assets
                      </p>
                      <p className="text-xl font-bold text-emerald-600">
                        {formatCurrency(summary.totalAssets)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Total Liabilities
                      </p>
                      <p className="text-xl font-bold text-rose-600">
                        {formatCurrency(summary.totalLiabilities)}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-1">
                        Net Worth
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(summary.netWorth)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <p>No data available</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  );
}
