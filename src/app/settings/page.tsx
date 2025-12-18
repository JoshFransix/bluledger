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
import { useState, useEffect } from "react";
import {
  User,
  Building,
  Save,
  Users,
  TrendingUp,
  Wallet,
  UserPlus,
  Trash2,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { Input, Button, Select, SelectItem, Tabs, Tab } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { ConfirmationModal } from "@/components/modals/ConfirmationModal";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams?.get("tab") || "organization";

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

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  // Sync orgName with currentOrg when organization changes
  useEffect(() => {
    if (currentOrg?.name) {
      setOrgName(currentOrg.name);
    }
  }, [currentOrg?.id, currentOrg?.name]);

  useEffect(() => {
    if (activeTab === "team" && currentOrgId) {
      fetchMembers();
    }
  }, [activeTab, currentOrgId]);

  const fetchMembers = async () => {
    if (!currentOrgId) return;
    setIsLoadingMembers(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/organizations/${currentOrgId}/members`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrgId || !inviteEmail) return;

    setIsInviting(true);
    setInviteMessage(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/organizations/${currentOrgId}/members/invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
        }
      );

      if (response.ok) {
        setInviteEmail("");
        setInviteRole("member");
        setInviteMessage({
          type: "success",
          text: "Member invited successfully!",
        });
        fetchMembers();
      } else {
        const error = await response.json();
        setInviteMessage({
          type: "error",
          text: error.message || "Failed to invite member",
        });
      }
    } catch (error) {
      setInviteMessage({
        type: "error",
        text: "Failed to invite member. Please try again.",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!currentOrgId) return;
    setMemberToDelete(memberId);
    setDeleteConfirmOpen(true);
  };

  const confirmRemoveMember = async () => {
    if (!currentOrgId || !memberToDelete) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/organizations/${currentOrgId}/members/${memberToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        setDeleteConfirmOpen(false);
        setMemberToDelete(null);
        fetchMembers();
      }
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
  };

  const isAdmin = currentOrg?.role === "admin";

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

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) {
      return "$0.00";
    }
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

        {/* Tabs */}
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => {
            const url =
              key === "organization" ? "/settings" : `/settings?tab=${key}`;
            window.history.pushState({}, "", url);
            window.dispatchEvent(new PopStateEvent("popstate"));
          }}
          color="primary"
          variant="underlined"
          classNames={{
            tabList:
              "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-primary",
          }}
          className="mb-6"
        >
          <Tab key="organization" title="Organization" />
          <Tab key="team" title="Team" />
        </Tabs>

        {activeTab === "organization" && (
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
                    <Input
                      type="text"
                      label="Organization Name"
                      variant="bordered"
                      value={orgName}
                      onValueChange={setOrgName}
                      placeholder={
                        currentOrg?.name || "Enter organization name"
                      }
                    />

                    <Input
                      type="text"
                      label="Organization ID"
                      variant="bordered"
                      value={currentOrgId?.toString() || ""}
                      isDisabled
                      description="This is your unique organization identifier"
                    />

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

                    <Button
                      type="submit"
                      color="primary"
                      startContent={<Save className="w-4 h-4" />}
                      isLoading={isSaving || isUpdating}
                      isDisabled={orgName.trim() === currentOrg?.name}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
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
                    <label className="block text-sm font-medium mb-2">
                      Role
                    </label>
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
                              {summary?.membersCount ?? 0}
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
                              {summary.stats?.accountsCount ?? 0}
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
                              {summary.stats?.transactionsCount ?? 0}
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
                      {summary.balances &&
                      Object.keys(summary.balances).length > 0 ? (
                        <>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Total Assets
                            </p>
                            <p className="text-xl font-bold text-emerald-600">
                              {Object.entries(summary.balances).map(
                                ([currency, data]: [string, any]) => (
                                  <span key={currency} className="block">
                                    {formatCurrency(data.assets || 0)}{" "}
                                    {currency}
                                  </span>
                                )
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Total Liabilities
                            </p>
                            <p className="text-xl font-bold text-rose-600">
                              {Object.entries(summary.balances).map(
                                ([currency, data]: [string, any]) => (
                                  <span key={currency} className="block">
                                    {formatCurrency(data.liabilities || 0)}{" "}
                                    {currency}
                                  </span>
                                )
                              )}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-1">
                              Net Worth
                            </p>
                            <p className="text-2xl font-bold text-primary">
                              {Object.entries(summary.netWorth || {}).map(
                                ([currency, value]: [string, any]) => (
                                  <span key={currency} className="block">
                                    {formatCurrency(value || 0)} {currency}
                                  </span>
                                )
                              )}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          No financial data available yet
                        </div>
                      )}
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
        )}

        {activeTab === "team" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Team Management */}
            <div className="lg:col-span-2 space-y-6">
              {/* Invite Member */}
              {isAdmin && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Invite Team Member
                    </CardTitle>
                    <CardDescription>
                      Invite users to join your organization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleInviteMember} className="space-y-4">
                      {inviteMessage && (
                        <div
                          className={`p-3 rounded-lg text-sm ${
                            inviteMessage.type === "success"
                              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600"
                              : "bg-destructive/10 border border-destructive/20 text-destructive"
                          }`}
                        >
                          {inviteMessage.text}
                        </div>
                      )}

                      <Input
                        type="email"
                        label="Email Address"
                        variant="bordered"
                        placeholder="user@example.com"
                        value={inviteEmail}
                        onValueChange={setInviteEmail}
                        isRequired
                        description="User must have an account to be invited"
                      />

                      <Select
                        label="Role"
                        variant="bordered"
                        selectedKeys={new Set([inviteRole])}
                        onSelectionChange={(keys) => {
                          const role = Array.from(keys)[0] as string;
                          setInviteRole(role);
                        }}
                        selectionMode="single"
                        disallowEmptySelection
                      >
                        <SelectItem key="admin" textValue="Admin">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            <div>
                              <p className="font-medium">Admin</p>
                              <p className="text-xs text-muted-foreground">
                                Full access to manage organization
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem key="member" textValue="Member">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <div>
                              <p className="font-medium">Member</p>
                              <p className="text-xs text-muted-foreground">
                                Can manage accounts and transactions
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem key="viewer" textValue="Viewer">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <div>
                              <p className="font-medium">Viewer</p>
                              <p className="text-xs text-muted-foreground">
                                Read-only access
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      </Select>

                      <Button
                        type="submit"
                        color="primary"
                        startContent={<UserPlus className="w-4 h-4" />}
                        isLoading={isInviting}
                      >
                        Send Invite
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Members List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Members
                  </CardTitle>
                  <CardDescription>
                    Manage your organization members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingMembers ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-16 bg-secondary/50 rounded-lg animate-pulse"
                        />
                      ))}
                    </div>
                  ) : members.length > 0 ? (
                    <div className="space-y-3">
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {member.name || member.email}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {member.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                member.role === "admin"
                                  ? "bg-primary/10 text-primary"
                                  : member.role === "viewer"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : "bg-emerald-500/10 text-emerald-500"
                              }`}
                            >
                              {member.role}
                            </span>
                            {isAdmin && member.userId !== user?.id && (
                              <Button
                                size="sm"
                                color="danger"
                                variant="light"
                                isIconOnly
                                onPress={() => handleRemoveMember(member.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No team members yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Team Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground font-medium">
                    Team Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Total Members
                    </p>
                    <p className="text-2xl font-bold">{members.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Admins</p>
                    <p className="text-2xl font-bold">
                      {members.filter((m) => m.role === "admin").length}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">
                      Members
                    </p>
                    <p className="text-2xl font-bold">
                      {members.filter((m) => m.role === "member").length}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </PageTransition>

      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        title="Remove Team Member"
        message="Are you sure you want to remove this member from the organization? This action cannot be undone."
        confirmText="Remove"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={confirmRemoveMember}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setMemberToDelete(null);
        }}
      />
    </DashboardLayout>
  );
}
