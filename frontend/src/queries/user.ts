import { authClient } from "@/lib/auth";
import { fetchClient } from "@/lib/fetch-client";
import { sessionQueryOptions } from "@/lib/query-options-factory";
import { handleAuthResponse, UserViewableError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUploadUserImageMutation() {
  return useMutation({
    mutationFn: async (body: { file: File }) => {
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

      const res = await fetchClient.POST(
        "/api/v1/storage/user-image-presigned-url",
        {
          body: {
            fileName: body.file.name,
            contentType: body.file.type,
          },
        },
      );

      if (res.error) {
        throw new UserViewableError("Failed to upload image");
      }

      const url = res.data.url;

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

      return { imageUrl: res.data.imageUrl };
    },
  });
}

export function useUpdateUserMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string; image?: string }) => {
      const res = await authClient.updateUser({
        name: body.name,
        image: body.image,
      });
      return handleAuthResponse(res);
    },

    onSuccess: () => {
      qc.invalidateQueries(sessionQueryOptions);
    },
  });
}
