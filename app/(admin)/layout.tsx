import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppSidebarProvider } from "@/components/app-sidebar-provider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if ((session.user as any).role !== "ADMIN") {
    redirect("/play");
  }

  return (
    <AppSidebarProvider role="ADMIN" userName={session.user?.email ?? "Admin"}>
      {children}
    </AppSidebarProvider>
  );
}
