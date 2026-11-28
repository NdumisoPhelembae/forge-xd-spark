// Server function the embedded widget calls on load to confirm the host page
// still credits ForgeXD. The logic lives in embed-guard.server.ts.
import { createServerFn } from "@tanstack/react-start";
import type { EmbedAccess } from "./embed-guard.server";

export const checkEmbedAccess = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => {
    const page =
      typeof data === "object" && data !== null
        ? String((data as { page?: unknown }).page ?? "")
        : "";
    return { page: page.slice(0, 2048) };
  })
  .handler(async ({ data }): Promise<EmbedAccess> => {
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const { embedAccess } = await import("./embed-guard.server");
    return embedAccess(getRequestHeader("referer"), data.page || undefined);
  });
