import type { InferHandlers } from "../../lib/types.js";
import type routes from "./storage.routes.js";
import { HTTP_STATUS_CODES } from "../../lib/constants.js";
import { getUserImagePresignedUrl } from "../../use-cases/storage.js";

const handlers: InferHandlers<typeof routes> = {
  userPresignedUrl: async (c) => {
    const { fileName, contentType } = c.req.valid("json");
    const authCtx = c.var.authCtx;

    const { url, key, imageUrl } = await getUserImagePresignedUrl(authCtx, fileName, contentType);

    return c.json(
      {
        url,
        key,
        imageUrl,
      },
      HTTP_STATUS_CODES.OK
    );
  },
};

export default handlers; 