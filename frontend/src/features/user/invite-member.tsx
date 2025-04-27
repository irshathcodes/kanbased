import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthData } from "@/queries/session";
import { authClient } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { handleAuthResponse } from "@/lib/utils";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRef } from "react";

export function InviteMemberDialog() {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const inviteMutation = useMutation({
    mutationFn: async ({
      email,
      role,
    }: {
      email: string;
      role: "member" | "admin";
    }) => {
      const res = await authClient.organization.inviteMember({
        email,
        role,
      });
      return handleAuthResponse(res);
    },
    onSuccess: () => {
      toast.success("Invitation sent successfully!");
      closeButtonRef.current?.click();
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const role = formData.get("role") as "member" | "admin";

    if (!email) return;
    inviteMutation.mutate({ email, role });
  };

  return (
    <DialogContent>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your organization
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="email">Invite Member</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email address"
            required
            disabled={inviteMutation.isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            name="role"
            defaultValue="admin"
            disabled={inviteMutation.isPending}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%221.5%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19.5%208.25l-7.5%207.5-7.5-7.5%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:16px] bg-[center_right_12px]"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <p className="text-sm text-muted-foreground">
            Choose the role for the invited user
          </p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button ref={closeButtonRef} type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={inviteMutation.isPending}>
            {inviteMutation.isPending && <Spinner />}
            Send Invitation
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
