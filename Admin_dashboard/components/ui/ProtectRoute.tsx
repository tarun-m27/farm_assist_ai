"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RouteProtectProps {
  children: React.ReactNode;
}

export default function ProtectRoute({ children }: RouteProtectProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      // Optionally validate the token (e.g., via API call if supported)
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push("/"); // Redirect to login page (root /)
    }
  }, [router]);

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse">Checking authentication...</div>
      </div>
    );
  }

  // Render children only if authenticated
  return isAuthenticated ? <>{children}</> : null;
}