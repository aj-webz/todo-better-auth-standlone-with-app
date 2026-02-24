"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import type { ReactElement } from "react";
import Sidebar from "@/components/sidebar/sidebar";

interface User {
  createdAt: string;
  email: string;
  id: string;
  role: "user" | "admin";
}

export default function AdminUsersPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("api/admin");
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to fetch users");
      }
      return res.json();
    },
  });

  let content: ReactElement;

  if (isLoading) {
    content = (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full rounded-md" />
        <Skeleton className="h-8 w-full rounded-md" />
        <Skeleton className="h-8 w-full rounded-md" />
      </div>
    );
  } else if (users && users.length > 0) {
    content = (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user.role}</TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  } else {
    content = (
      <p className="text-center text-muted-foreground">No users found.</p>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-8">
        <Card className="mx-auto w-full max-w-5xl rounded-2xl border border-border/50 shadow-lg">
          <CardHeader className="px-6 py-4">
            <CardTitle className="font-bold text-2xl">Total Users</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">{content}</CardContent>
        </Card>
      </main>
    </div>
  );
}
