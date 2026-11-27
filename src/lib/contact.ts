// Contact enquiries go to the dedicated Fluent Forms "Contact" form (ID 4).
// Never send them to the subscription form; that one is reserved for signups.
import { createServerFn } from "@tanstack/react-start";
import { FLUENT_FORMS, submitFluentForm } from "./fluentforms";

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    const input = (typeof data === "object" && data !== null ? data : {}) as Record<
      string,
      unknown
    >;
    const firstName = String(input["firstName"] ?? "").trim();
    const lastName = String(input["lastName"] ?? "").trim();
    const email = String(input["email"] ?? "")
      .trim()
      .toLowerCase();
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
    // The Fluent Form has no phone field, so the optional number rides along
    // at the end of the message and is never lost.
    const description = data.phone ? `${data.message}\n\nPhone: ${data.phone}` : data.message;
    await submitFluentForm(FLUENT_FORMS.contact, {
      "names[first_name]": data.firstName,
      "names[last_name]": data.lastName,
      email: data.email,
      description,
    });
    return { ok: true };
  });
