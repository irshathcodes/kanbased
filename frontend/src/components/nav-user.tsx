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
  Mail,
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
import { useAuthData } from "@/queries/session";
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
import { useQuery } from "@rocicorp/zero/react";
import { getOrganizationListQuery } from "@/lib/zero-queries";
import { useZ } from "@/lib/zero-cache";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { InviteMemberDialog } from "@/features/user/invite-member";

export function NavUser() {
  const userData = useAuthData();
  const z = useZ();
  const [organizationsList] = useQuery(getOrganizationListQuery(z));
  const currentOrganization = organizationsList.find(
    (org) => org.id === userData.activeOrganizationId,
  );

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await authClient.signOut();
      return handleAuthResponse(res);
    },
    onSuccess: () => {
      localStorage.removeItem("auth-token");
      router.navigate({ to: "/login", reloadDocument: true });
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      const res = await authClient.sendVerificationEmail({
        email: userData.email,
        callbackURL: getOrigin(),
      });
      return handleAuthResponse(res);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async () => {
      const res = await authClient.forgetPassword({
        email: userData.email,
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
      localStorage.removeItem("auth-token");
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
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground py-0!"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userData.image!} alt={userData.name} />
                  <AvatarFallback>{userData.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="font-medium truncate">{userData.name}</span>

                  {currentOrganization && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3 shrink-0" />
                      <span className="truncate">
                        {currentOrganization.name}
                      </span>
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

              <DialogTrigger asChild>
                <DropdownMenuItem className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Invite member
                </DropdownMenuItem>
              </DialogTrigger>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <UserRound className="mr-2 h-4 w-4" />
                  Switch organization
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {organizationsList.map((org) => (
                    <DropdownMenuCheckboxItem
                      checked={org.id === userData.activeOrganizationId}
                      key={org.id}
                      onCheckedChange={() => handleSwitchOrganization(org.id)}
                    >
                      {org.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />

              {!userData.emailVerified && (
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

          <InviteMemberDialog />
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
