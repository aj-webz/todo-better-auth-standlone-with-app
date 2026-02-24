import NavbarClient from "@/components/navbar/navbar-client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavbarClient />
      {children}
    </div>
  );
}
