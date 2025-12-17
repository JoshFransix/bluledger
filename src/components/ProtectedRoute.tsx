"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useOrganizations } from "@/hooks/useOrganizations";

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
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
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to BluLedger!</h2>
          <p className="text-muted-foreground mb-6">
            Let's create your first organization to get started.
          </p>
          <button
            onClick={async () => {
              const org = await createOrganization({ name: "My Organization" });
              setCurrentOrg(org.id);
            }}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create Organization
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
