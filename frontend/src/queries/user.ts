import {useMutation, useQueryClient} from "@tanstack/react-query";
import {authClient} from "@/lib/auth";
import {post} from "@/lib/fetch-client";
import {authQueryOptions} from "@/lib/query-options-factory";
import {UserViewableError, handleAuthResponse} from "@/lib/utils";

export function useUploadUserImageMutation() {
  return useMutation({
    mutationFn: async (body: {file: File}) => {
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (body.file.size > MAX_FILE_SIZE) {
        throw new UserViewableError("File size must be less than 5MB");
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];

      if (!allowedTypes.includes(body.file.type)) {
        throw new UserViewableError(
          "Please upload a valid image file (JPEG, PNG, GIF, or WebP)",
        );
      }

      const res = await post("/api/v1/storage/user-image-presigned-url", {
        fileName: body.file.name,
        contentType: body.file.type,
      });

      if (!res.ok) {
        throw new UserViewableError("Failed to upload image");
      }

      const data = await res.json();
      const url = data.url;

      const uploadRes = await fetch(url, {
        method: "PUT",
        body: body.file,
        headers: {
          "Content-Type": body.file.type,
        },
      });

      if (!uploadRes.ok) {
        throw new UserViewableError("Failed to upload image");
      }

      return {imageUrl: data.imageUrl};
    },
  });
}

export function useUpdateUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: {name: string; image?: string}) => {
      const res = await authClient.updateUser({
        name: body.name,
        image: body.image,
      });
      return handleAuthResponse(res);
    },

    onSuccess: () => {
      return qc.invalidateQueries(authQueryOptions, {throwOnError: true});
    },
  });
}
