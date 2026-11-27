// ForgeXD newsletter: posts new subscribers into the Fluent Forms
// "ForgeXD News/Updates And Guides Subscription Form" (ID 3) on the WordPress
// backend. This runs only on the server, so nothing about the CMS is shipped
// to the browser.
import { createServerFn } from "@tanstack/react-start";
import { FLUENT_FORMS, submitFluentForm } from "./fluentforms";

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const email =
      typeof data === "object" && data !== null
        ? String((data as { email?: unknown }).email ?? "")
            .trim()
            .toLowerCase()
        : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("A valid email address is required.");
    }
    return { email };
  })
  .handler(async ({ data }) => {
    await submitFluentForm(FLUENT_FORMS.subscription, { email: data.email });
    return { ok: true };
  });
