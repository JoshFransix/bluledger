"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useOrganizations } from "@/hooks/useOrganizations";
import { Building2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    organizations,
    isLoading: orgsLoading,
    currentOrgId,
    setCurrentOrg,
    createOrganization,
  } = useOrganizations();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    // Auto-select or create organization
    if (
      isAuthenticated &&
      !orgsLoading &&
      organizations.length > 0 &&
      !currentOrgId
    ) {
      setCurrentOrg(organizations[0].id);
    }
  }, [
    isAuthenticated,
    orgsLoading,
    organizations,
    currentOrgId,
    setCurrentOrg,
  ]);

  // Show loading state
  if (authLoading || orgsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium">Loading BluLedger...</p>
          <p className="text-xs text-muted-foreground mt-1">Please wait</p>
        </div>
      </div>
    );
  }

  // Not authenticated - will redirect
  if (!isAuthenticated) {
    return null;
  }

  // Need to create organization
  if (organizations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-background">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent 
                          flex items-center justify-center shadow-xl mx-auto mb-4"
            >
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to BluLedger!</h2>
            <p className="text-muted-foreground">
              Let's create your first organization to get started with financial
              management.
            </p>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const orgName = formData.get("orgName") as string;
              if (orgName) {
                const org = await createOrganization({ name: orgName });
                setCurrentOrg(org.id);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Organization Name
              </label>
              <input
                type="text"
                name="orgName"
                placeholder="My Company"
                required
                className="w-full px-4 py-3 rounded-lg border border-border bg-background
                         focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg 
                       hover:bg-primary/90 transition-colors font-medium"
            >
              Create Organization
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
