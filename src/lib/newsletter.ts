// ForgeXD newsletter — posts new subscribers straight into the ForgeXD
// newsletter list on the WordPress backend (FluentCRM). The subscribe URL
// only exists inside this server handler, so it is never shipped to the browser.
import { createServerFn } from "@tanstack/react-start";

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const email =
      typeof data === "object" && data !== null
        ? String((data as { email?: unknown }).email ?? "").trim().toLowerCase()
        : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("A valid email address is required.");
    }
    return { email };
  })
  .handler(async ({ data }) => {
    const response = await fetch(
      "https://cms.forgexd.co.za/?fluentcrm=1&route=contact&hash=b4a021ef-4062-4a0e-a66c-3873b738e2f3",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      },
    );
    if (!response.ok) {
      console.error(`FluentCRM subscribe failed [${response.status}]: ${await response.text()}`);
      throw new Error("The newsletter service is not responding.");
    }
    const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
    if (result && result.success === false) {
      throw new Error("The newsletter service rejected the request.");
    }
    return { ok: true };
  });
