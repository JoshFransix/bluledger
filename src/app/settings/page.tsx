import { Suspense } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { getTeamMembers, getInvoices } from "@/lib/data";
import { 
  User, 
  Mail, 
  Shield, 
  CreditCard, 
  Bell, 
  Lock,
  Building,
  Check,
  Clock,
  MoreHorizontal 
} from "lucide-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

export default async function SettingsPage() {
  const [teamMembers, invoices] = await Promise.all([
    getTeamMembers(),
    getInvoices(),
  ]);

  return (
    <DashboardLayout title="Settings">
      <PageHeader
        title="Settings"
        description="Manage your account, team, and billing preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Security */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Update your personal information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent
                                flex items-center justify-center text-white text-2xl font-bold">
                  JD
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <input
                        type="text"
                        defaultValue="John"
                        className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border
                                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                                   transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <input
                        type="text"
                        defaultValue="Doe"
                        className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border
                                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                                   transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        defaultValue="john@bluledger.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border
                                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                                   transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        defaultValue="Acme Corporation"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border
                                   focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                                   transition-all"
                      />
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg
                                     hover:bg-primary/90 transition-colors text-sm font-medium">
                    Save Changes
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Team Members
                </CardTitle>
                <CardDescription>
                  Manage your team and their permissions
                </CardDescription>
              </div>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg
                                 hover:bg-primary/90 transition-colors text-sm font-medium">
                Invite Member
              </button>
            </CardHeader>
            <CardContent className="p-0">
              <Suspense fallback={<TeamSkeleton />}>
                <div className="divide-y divide-border">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-accent/50
                                        flex items-center justify-center text-sm font-semibold">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium",
                          member.status === "active" 
                            ? "bg-success/10 text-success" 
                            : "bg-warning/10 text-warning"
                        )}>
                          {member.status === "active" ? "Active" : "Pending"}
                        </span>
                        <span className="text-sm text-muted-foreground">{member.role}</span>
                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Suspense>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                </div>
                <button className="px-4 py-2 bg-secondary hover:bg-secondary/80 
                                   rounded-lg transition-colors text-sm font-medium">
                  Change Password
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground
                                   rounded-lg transition-colors text-sm font-medium hover:bg-primary/90">
                  Enable 2FA
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Billing & Notifications */}
        <div className="space-y-6">
          {/* Current Plan */}
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-primary/10 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold">Pro Plan</span>
                  <span className="text-2xl font-bold">{formatCurrency(299)}<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                </div>
                <p className="text-sm text-muted-foreground">Billed monthly • Renews Dec 1, 2025</p>
              </div>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success" />
                  Unlimited team members
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success" />
                  Advanced analytics
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success" />
                  Priority support
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success" />
                  Custom integrations
                </li>
              </ul>
              <button className="w-full px-4 py-2 bg-secondary hover:bg-secondary/80
                                 rounded-lg transition-colors text-sm font-medium">
                Upgrade Plan
              </button>
            </CardContent>
          </Card>

          {/* Invoices */}
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Suspense fallback={<InvoiceSkeleton />}>
                <div className="divide-y divide-border">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between px-6 py-3 hover:bg-secondary/30 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{invoice.id}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(invoice.date)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{formatCurrency(invoice.amount)}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium",
                          invoice.status === "paid" 
                            ? "bg-success/10 text-success" 
                            : "bg-warning/10 text-warning"
                        )}>
                          {invoice.status === "paid" ? "Paid" : "Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Suspense>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <NotificationToggle
                title="Email Notifications"
                description="Receive updates via email"
                defaultChecked
              />
              <NotificationToggle
                title="Weekly Reports"
                description="Get weekly summary reports"
                defaultChecked
              />
              <NotificationToggle
                title="Marketing Emails"
                description="Receive product updates"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function NotificationToggle({
  title,
  description,
  defaultChecked = false,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-11 h-6 bg-secondary rounded-full peer 
                        peer-checked:after:translate-x-full peer-checked:bg-primary
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:bg-white after:rounded-full after:h-5 after:w-5
                        after:transition-all transition-colors" />
      </label>
    </div>
  );
}

function TeamSkeleton() {
  return (
    <div className="p-6 space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-14 animate-pulse bg-secondary/50 rounded-lg" />
      ))}
    </div>
  );
}

function InvoiceSkeleton() {
  return (
    <div className="p-6 space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-10 animate-pulse bg-secondary/50 rounded-lg" />
      ))}
    </div>
  );
}
