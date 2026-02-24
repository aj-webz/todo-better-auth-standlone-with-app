"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronLeft, LayoutDashboard, Menu, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
//import { authClient } from "@/lib/auth-client";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  //const { data, isPending, error } = authClient.useSession();
  return (
    <div
      className={cn(
        "h-full cursor-pointer select-none border-border/50 border-r bg-background shadow-sm transition-all duration-300 ease-in-out",
        open ? "w-50" : "w-16"
      )}
    >
      <div className="flex h-full flex-col py-4">
        <div className="mb-6 flex justify-end px-3">
          <Button
            className="h-8 w-8 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
            size="icon"
            variant="ghost"
          >
            {open ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </Button>
        </div>

        <nav className="flex-1 space-y-6 px-3.5">
          <SidebarItem
            href="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            open={open}
          />
          <SidebarItem
            href="/manage"
            icon={<Settings size={20} />}
            label="Manage"
            open={open}
          />
          {/* {!isPending && data === "admin" && (
            <SidebarItem href="/admin" label="Administer" open={open} icon={<Shield size={20} />} />
          )} */}
        </nav>
      </div>
    </div>
  );
}

function SidebarItem({
  href,
  icon,
  label,
  open,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  open: boolean;
}) {
  return (
    <Link
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground text-sm transition-all duration-300 hover:bg-muted hover:text-foreground"
      href={href}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="shrink-0">{icon}</span>

      <span
        className={cn(
          "overflow-hidden whitespace-nowrap transition-all duration-300",
          open
            ? "w-auto translate-x-0 opacity-100"
            : "w-0 -translate-x-2 opacity-0"
        )}
      >
        {label}
      </span>
    </Link>
  );
}
