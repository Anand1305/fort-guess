"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { Gamepad2 } from "lucide-react";
import { ClipboardMinus } from "lucide-react";

type Props = {
  role: "ADMIN" | "PLAYER";
  userName: string;
  children: React.ReactNode;
};

export function AppSidebarProvider({ role, userName, children }: Props) {
  return (
    <SidebarProvider>
      <Sidebar>
        {/* HEADER */}
        <SidebarHeader className="border-b">
          <div className="px-2 py-1">
            <h2 className="text-lg font-semibold">Fort Guess</h2>
            <p className="text-xs text-muted-foreground capitalize">
              {role.toLowerCase()}
            </p>
          </div>
        </SidebarHeader>

        {/* CONTENT */}
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {role === "ADMIN" && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/forts">Forts</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/reports">Reports</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              )}

              {role === "PLAYER" && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/play">Play</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/leaderboard">Leaderboard</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/profile">Profile</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem> */}
                </>
              )}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* FOOTER */}
        <SidebarFooter className="border-t">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton disabled>
                <User className="mr-2 h-4 w-4" />
                {userName}
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="bg-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1">
        {/* TOP BAR */}
        <header className="h-14 border-b flex items-center px-4">
          <SidebarTrigger />
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
