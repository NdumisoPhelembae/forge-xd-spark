// Contact enquiries require a dedicated FluentCRM webhook. Never send them to
// the newsletter webhook; that endpoint is reserved for newsletter signups.
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
  .handler(async () => {
    throw new Error("Contact enquiries are temporarily unavailable while the dedicated form connection is set up.");
  });
