"use client";

import {
  ChevronsUpDown,
  LogOut,
  MailWarning,
  Lock,
  Building2,
  Settings,
  Plus,
  UserRound,
} from "lucide-react";
import { handleAuthResponse } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/queries/session";
import { authClient } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { getOrigin } from "@/lib/constants";
import { router } from "@/main";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sessionQueryOptions } from "@/lib/query-options-factory";
import { queryClient } from "@/lib/query-client";
import { useQuery } from "@rocicorp/zero/react";
import { getOrganizationListQuery } from "@/lib/zero-queries";
import { useZ } from "@/lib/zero-cache";

export function NavUser() {
  const { user, session } = useSession();
  const z = useZ();
  const [organizationsList] = useQuery(getOrganizationListQuery(z));
  const currentOrganization = organizationsList.find(
    (org) => org.id === session.activeOrganizationId,
  );

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await authClient.signOut();
      return handleAuthResponse(res);
    },
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.setQueryDefaults(sessionQueryOptions.queryKey, {
        staleTime: 0,
      });
      router.navigate({ to: "/login" });
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      const res = await authClient.sendVerificationEmail({
        email: user.email,
        callbackURL: getOrigin(),
      });
      return handleAuthResponse(res);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async () => {
      const res = await authClient.forgetPassword({
        email: user.email,
        redirectTo: `${getOrigin()}/reset-password`,
      });
      return handleAuthResponse(res);
    },
  });

  const switchOrganizationMutation = useMutation({
    mutationFn: async (organizationId: string) => {
      const res = await authClient.organization.setActive({
        organizationId,
      });
      return handleAuthResponse(res);
    },
    onSuccess: () => {
      localStorage.removeItem("token");
      window.location.href = "/";
    },
  });

  const handleLogout = () => {
    toast.promise(() => logoutMutation.mutateAsync(), {
      loading: "Logging out...",
      success: "Logged out successfully",
      error: "Failed to log out",
    });
  };

  const handleVerifyEmail = () => {
    toast.promise(() => verifyEmailMutation.mutateAsync(), {
      loading: "Sending verification email...",
      success: "Verification email sent successfully, please check your email.",
      error: "Failed to send verification email",
      position: "bottom-center",
    });
  };

  const handleResetPassword = async () => {
    toast.promise(() => forgotPasswordMutation.mutateAsync(), {
      loading: "Sending reset password email...",
      success:
        "Reset password email sent successfully, please check your email.",
      error: "Failed to send reset password email",
      position: "top-center",
    });
  };

  const handleSwitchOrganization = (organizationId: string) => {
    const promise = switchOrganizationMutation.mutateAsync(organizationId);
    toast.promise(promise, {
      loading: "Switching organization...",
      error: "Failed to switch organization",
      position: "top-center",
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground !py-0"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image!} alt={user.name} />
                <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="font-medium truncate">{user.name}</span>

                {currentOrganization && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Building2 className="h-3 w-3 shrink-0" />
                    <span className="truncate">{currentOrganization.name}</span>
                  </div>
                )}
              </div>

              <ChevronsUpDown className="ml-auto h-4 w-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start" side="right">
            <DropdownMenuLabel>Organization</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/new-organization">
                <Plus className="mr-2 h-4 w-4" />
                Create new organization
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserRound className="mr-2 h-4 w-4" />
                Switch organization
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {organizationsList.map((org) => (
                  <DropdownMenuCheckboxItem
                    checked={org.id === session.activeOrganizationId}
                    key={org.id}
                    onCheckedChange={() => handleSwitchOrganization(org.id)}
                  >
                    {org.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />

            {!user.emailVerified && (
              <DropdownMenuItem onClick={handleVerifyEmail}>
                <MailWarning className="mr-2 h-4 w-4" />
                Verify Email
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={handleResetPassword}>
              <Lock className="mr-2 h-4 w-4" />
              Reset Password
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link to="/user-settings">
                <Settings className="mr-2 h-4 w-4" />
                User Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
