"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@workspace/ui/components/navigation-menu";
import { LayoutDashboard, Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <NavigationMenuLink asChild>
      <Link
        className={`font-medium text-sm transition ${
          active
            ? "font-semibold text-blue-600"
            : "text-neutral-700 hover:text-blue-600"
        }`}
        href={href}
      >
        {label}
      </Link>
    </NavigationMenuLink>
  );
}

export default function Navbar() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: session, isPending: isLoading } = authClient.useSession();

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut();
      if (error) {
        throw new Error(error.message ?? "Sign out failed");
      }
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "Failed to logout");
    },
  });

  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-white px-9">
      <span className="font-semibold text-lg text-neutral-900 tracking-tight">
        WORK <span className="text-blue-600">TRACKER</span>
      </span>

      <div className="flex items-center gap-10">
        <NavigationMenu>
          <NavigationMenuList className="gap-4">
            <NavigationMenuItem>
              <NavLink href="/dashboard" label="Dashboard" />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavLink href="/manage" label="Manage" />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded-full p-1 transition hover:bg-neutral-100 disabled:opacity-50"
              disabled={isLoggingOut || isLoading}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  alt="User"
                  src={session?.user?.image || "/avatar.png"}
                />
                <AvatarFallback>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    session?.user?.email?.[0]?.toUpperCase() || "U"
                  )}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <div className="truncate px-2 py-1.5 text-muted-foreground text-xs">
              {session?.user?.email ||
                (isLoading ? "Loading..." : "Not logged in")}
            </div>

            <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-destructive"
              disabled={isLoggingOut}
              onClick={() => logout()}
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
