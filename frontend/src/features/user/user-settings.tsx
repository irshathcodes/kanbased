import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useSession } from "@/queries/session";
import {
  useUploadUserImageMutation,
  useUpdateUserMutation,
} from "@/queries/user";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export function UserSettings() {
  const { user } = useSession();
  const defaultUserImage = user.image ?? undefined;
  const [previewUrl, setPreviewUrl] = useState(defaultUserImage);
  const uploadImageMutation = useUploadUserImageMutation();
  const updateUserMutation = useUpdateUserMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name");

    updateUserMutation.mutate(
      {
        name: name as string,
        image: previewUrl,
      },
      {
        onSuccess: () => {
          toast.success("User updated successfully");
        },
      },
    );
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clean up previous preview URL if it exists
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    uploadImageMutation.mutate(
      { file },
      {
        onSuccess: ({ imageUrl }) => {
          setPreviewUrl(imageUrl);
        },
        onError: () => {
          setPreviewUrl(defaultUserImage);
        },
        onSettled: () => {
          URL.revokeObjectURL(url);
        },
      },
    );
  };

  const handleReset = () => {
    setPreviewUrl(defaultUserImage);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-xl tracking-tight font-bold mb-8">User Settings</h1>
        <form
          onReset={handleReset}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Label htmlFor="avatar" className="mb-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={previewUrl} alt="Profile picture" />
                  <AvatarFallback>
                    {user.name[0]} {user.name?.[1]}
                  </AvatarFallback>
                </Avatar>
              </Label>

              <div className="flex flex-col">
                <Label htmlFor="avatar" className="mb-2">
                  Profile Picture
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="w-full"
                  disabled={
                    uploadImageMutation.isPending ||
                    updateUserMutation.isPending
                  }
                />

                {uploadImageMutation.isPending && (
                  <div className="flex items-center space-x-2 mt-1.5">
                    <Spinner />
                    <p className="text-xs text-gray-500">
                      Uploading profile picture...
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name}
                placeholder="Jon Snow"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="reset" variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button
              disabled={
                uploadImageMutation.isPending || updateUserMutation.isPending
              }
              type="submit"
            >
              {updateUserMutation.isPending && <Spinner />}
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
