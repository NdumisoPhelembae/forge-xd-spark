import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { embedAccess, inspectHostHtml, resetEmbedGuard } from "./embed-guard.server";

const TOOL = "https://forgexd.co.za/tools/free-on-page-seo-audit-tool";
const page = (credit: string, head = "") =>
  `<html><head>${head}</head><body><div data-forgexd-seo-audit data-theme="light">${credit}</div></body></html>`;

describe("inspectHostHtml", () => {
  it("passes the snippet as given", () => {
    assert.equal(
      inspectHostHtml(page(`<p>Powered by <a href="${TOOL}">ForgeXD</a></p>`)).status,
      "ok",
    );
  });

  it("blocks when the credit link is removed", () => {
    assert.equal(inspectHostHtml(page("")).status, "missing");
  });

  it("blocks nofollow, sponsored and ugc links", () => {
    for (const rel of ["nofollow", "sponsored", "ugc noopener"]) {
      assert.equal(
        inspectHostHtml(page(`<a href="${TOOL}" rel="${rel}">ForgeXD</a>`)).status,
        "missing",
        rel,
      );
    }
  });

  it("blocks a hidden link and a nofollow page", () => {
    assert.equal(
      inspectHostHtml(page(`<a href="${TOOL}" style="display:none">ForgeXD</a>`)).status,
      "missing",
    );
    assert.equal(
      inspectHostHtml(
        page(`<a href="${TOOL}">ForgeXD</a>`, `<meta name="robots" content="index, nofollow">`),
      ).status,
      "missing",
    );
  });

  it("accepts any followed forgexd.co.za link, including www", () => {
    assert.equal(
      inspectHostHtml(page(`<a href="https://www.forgexd.co.za/">ForgeXD</a>`)).status,
      "ok",
    );
  });

  it("never blocks a page whose HTML does not hold the embed code", () => {
    assert.equal(
      inspectHostHtml("<html><body><div id=app></div></body></html>").status,
      "unverifiable",
    );
  });
});

describe("embedAccess", () => {
  beforeEach(() => resetEmbedGuard());

  it("refuses a direct visit with no host page", async () => {
    assert.deepEqual(await embedAccess(undefined, undefined), {
      allowed: false,
      reason: "not-embedded",
    });
  });

  it("refuses a page address from another site than the referrer", async () => {
    assert.deepEqual(await embedAccess("https://cheater.example/", "https://ghosttraders.co/x/"), {
      allowed: false,
      reason: "page-mismatch",
    });
  });

  it("does not treat a request from inside the widget as forgexd.co.za", async () => {
    const result = await embedAccess(
      "https://forgexd.co.za/embed/seo-audit?theme=light",
      undefined,
    );
    assert.equal(result.allowed, false);
  });

  it("allows forgexd.co.za itself", async () => {
    assert.deepEqual(await embedAccess("https://forgexd.co.za/", undefined), { allowed: true });
  });
});
