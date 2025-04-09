import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import { jsonContent, jsonContentRequired } from "../../lib/schema-helpers.js";
import { HTTP_STATUS_CODES } from "../../lib/constants.js";
import { ResponseBuilder } from "../../lib/response-builder.js";

const routes = {
  userPresignedUrl: createRoute({
    method: "post",
    path: "/storage/user-image-presigned-url",
    request: {
      body: jsonContentRequired(
        z.object({
          fileName: z.string(),
          contentType: z.string().refine(
            (type) => type.startsWith('image/'),
            "Only image files are allowed"
          ),
        })
      ),
    },
    responses: ResponseBuilder.withAuthAndValidation({
      [HTTP_STATUS_CODES.OK]: jsonContent(
        z.object({
          url: z.string(),
          key: z.string(),
          imageUrl: z.string(),
        })
      ),
    }),
  }),
};

export default routes; 