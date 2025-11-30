"use client";

import {
  ChevronsUpDown,
  Lock,
  LogOut,
  Moon,
  Settings,
  Sun,
  SunMoon,
} from "lucide-react";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {Link} from "@tanstack/react-router";
import {handleAuthResponse} from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useAuthData} from "@/queries/session";
import {authClient} from "@/lib/auth";
import {getOrigin} from "@/lib/constants";
import {router} from "@/main";
import {Dialog} from "@/components/ui/dialog";
import UserAvatar from "@/components/user-avatar";
import {Button} from "./ui/button";
import {useAppContext} from "@/state/app-state";

export function UserMenu() {
  const userData = useAuthData();
  const {theme, updateTheme} = useAppContext();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await authClient.signOut();
      return handleAuthResponse(res);
    },
    onSuccess: () => {
      localStorage.removeItem("auth-token");
      router.navigate({to: "/login", reloadDocument: true});
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

  const handleLogout = () => {
    toast.promise(() => logoutMutation.mutateAsync(), {
      loading: "Logging out...",
      success: "Logged out successfully",
      error: "Failed to log out",
    });
  };

  const handleResetPassword = () => {
    toast.promise(() => forgotPasswordMutation.mutateAsync(), {
      loading: "Sending reset password email...",
      success:
        "Reset password email sent successfully, please check your email.",
      error: "Failed to send reset password email",
      position: "top-center",
    });
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <UserAvatar name={userData.name!} imageUrl={userData.image} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <UserAvatar name={userData.name!} imageUrl={userData.image} />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userData.name}</span>
                <span className="truncate text-xs">{userData.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SunMoon size={16} />
              <span className="ml-4">Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent sideOffset={8}>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) =>
                  updateTheme(value as "light" | "dark" | "system")
                }
              >
                <DropdownMenuRadioItem value="light">
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem asChild>
            <Link to="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleResetPassword}>
            <Lock className="mr-2 h-4 w-4" />
            Reset Password
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
}
