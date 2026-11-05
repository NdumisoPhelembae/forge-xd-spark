// ForgeXD contact form — posts enquiries straight into the ForgeXD CRM
// (FluentCRM) on the WordPress backend. The webhook URL only exists inside
// this server handler, so it is never shipped to the browser.
import { createServerFn } from "@tanstack/react-start";

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const input = (typeof data === "object" && data !== null ? data : {}) as Record<string, unknown>;
    const firstName = String(input["firstName"] ?? "").trim();
    const lastName = String(input["lastName"] ?? "").trim();
    const email = String(input["email"] ?? "").trim().toLowerCase();
    const phone = String(input["phone"] ?? "").trim();
    const message = String(input["message"] ?? "").trim();
    if (!firstName || !lastName) {
      throw new Error("Please enter your first and last name.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("A valid email address is required.");
    }
    if (message.length < 10) {
      throw new Error("Please tell us a little about your project or challenge.");
    }
    return { firstName, lastName, email, phone, message };
  })
  .handler(async ({ data }) => {
    const response = await fetch(
      "https://cms.forgexd.co.za/?fluentcrm=1&route=contact&hash=b4a021ef-4062-4a0e-a66c-3873b738e2f3",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          ...(data.phone ? { phone: data.phone } : {}),
          message: data.message,
        }),
      },
    );
    if (!response.ok) {
      console.error(`FluentCRM contact failed [${response.status}]: ${await response.text()}`);
      throw new Error("The contact service is not responding. Please try again.");
    }
    const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
    if (result && result.success === false) {
      throw new Error("The contact service rejected the request. Please try again.");
    }
    return { ok: true };
  });
