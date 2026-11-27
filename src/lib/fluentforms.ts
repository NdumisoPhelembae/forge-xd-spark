// Server-side bridge into Fluent Forms on the ForgeXD WordPress backend.
// Submissions are posted to the same public endpoint the embedded forms use,
// so every entry lands in Fluent Forms > Entries and triggers the form's own
// notifications and integrations. This only ever runs on the server.
const CMS_URL = "https://cms.forgexd.co.za";

export const FLUENT_FORMS = {
  contact: 4,
  subscription: 3,
} as const;

type FluentErrors = Record<string, Record<string, string> | string>;

function firstError(errors: FluentErrors | undefined): string | null {
  if (!errors) return null;
  for (const value of Object.values(errors)) {
    if (typeof value === "string") return value;
    const message = Object.values(value)[0];
    if (message) return message;
  }
  return null;
}

export async function submitFluentForm(
  formId: number,
  fields: Record<string, string>,
): Promise<void> {
  const data = new URLSearchParams(fields).toString();
  const body = new URLSearchParams({
    action: "fluentform_submit",
    form_id: String(formId),
    data,
  });

  const response = await fetch(`${CMS_URL}/wp-admin/admin-ajax.php`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });

  const result = (await response.json().catch(() => null)) as {
    errors?: FluentErrors;
    data?: unknown;
  } | null;

  if (response.ok && !result?.errors) return;

  // 423 is Fluent Forms' validation response; surface its message to the visitor.
  const validation = firstError(result?.errors);
  if (validation) throw new Error(validation);

  console.error(`Fluent Forms submit failed [form ${formId}, ${response.status}]`, result);
  throw new Error("We could not send that right now. Please try again in a moment.");
}
