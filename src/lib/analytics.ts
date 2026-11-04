// Google Analytics — the measurement ID is a public tag identifier, but it is
// kept in the secret store and handed to the browser through this server
// function so it lives in one place and can be rotated without code changes.
import { createServerFn } from "@tanstack/react-start";

export const getAnalyticsMeasurementId = createServerFn({ method: "GET" }).handler(() => {
  // Public GA4 tag ID, embedded so self-hosted servers (xCloud) need no env setup.
  const id = process.env["GOOGLE_ANALYTICS_MEASUREMENT_ID"]?.trim();
  return id || "G-TCB0TLQS0M";
});
