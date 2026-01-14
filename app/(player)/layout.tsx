import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppSidebarProvider } from "@/components/app-sidebar-provider";

export default async function PlayerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if ((session.user as any).role !== "PLAYER") {
    redirect("/forts");
  }

  return (
    <AppSidebarProvider
      role="PLAYER"
      userName={session.user?.email ?? "Player"}
    >
      {children}
    </AppSidebarProvider>
  );
}
