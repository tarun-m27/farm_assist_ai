"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export function SiteHeader() {
  const router = useRouter();

  function handleSignOut() {
    localStorage.removeItem("jwtToken");
    toast.success(" admin signed out successfully")
    router.push("/"); 
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <span className=" text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-green-500 to-teal-500 dark:from-blue-400 dark:via-green-400 dark:to-teal-400">
          FarmAssist
        </span>
        <span className="ml-1 text-sm bg-green-600 text-white dark:bg-green-400 dark:text-gray-900 px-1 rounded">
          AI
        </span>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
