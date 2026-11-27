import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  checkRateLimit,
  fetchPublicPage,
  isPublicAddress,
  validateTarget,
} from "./page-fetch.server";

describe("isPublicAddress", () => {
  it("blocks private, loopback, link local and reserved IPv4", () => {
    for (const ip of [
      "127.0.0.1",
      "10.1.2.3",
      "172.16.0.1",
      "172.31.255.255",
      "192.168.1.1",
      "169.254.169.254",
      "100.64.0.1",
      "0.0.0.0",
      "224.0.0.1",
      "255.255.255.255",
    ]) {
      assert.equal(isPublicAddress(ip), false, ip);
    }
  });

  it("allows public IPv4", () => {
    for (const ip of ["8.8.8.8", "1.1.1.1", "172.32.0.1", "102.130.1.1"]) {
      assert.equal(isPublicAddress(ip), true, ip);
    }
  });

  it("blocks private IPv6 and IPv4 hidden inside IPv6", () => {
    for (const ip of [
      "::1",
      "::",
      "fe80::1",
      "fc00::1",
      "fd12:3456::1",
      "ff02::1",
      "::ffff:127.0.0.1",
      "::ffff:7f00:1",
      "::ffff:10.0.0.1",
      "64:ff9b::a00:1",
      "2001:db8::1",
    ]) {
      assert.equal(isPublicAddress(ip), false, ip);
    }
  });

  it("allows public IPv6", () => {
    assert.equal(isPublicAddress("2606:4700:4700::1111"), true);
    assert.equal(isPublicAddress("::ffff:8.8.8.8"), true);
  });

  it("rejects things that are not IP addresses", () => {
    assert.equal(isPublicAddress("example.com"), false);
  });
});

describe("validateTarget", () => {
  it("accepts normal public URLs", () => {
    assert.equal(validateTarget("https://forgexd.co.za/blog").hostname, "forgexd.co.za");
    assert.equal(validateTarget("http://example.com:80/").hostname, "example.com");
  });

  it("refuses unsafe URLs", () => {
    for (const url of [
      "ftp://example.com",
      "file:///etc/passwd",
      "https://user:pass@example.com",
      "https://example.com:8080",
      "http://localhost/",
      "http://127.0.0.1/",
      "http://[::1]/",
      "http://169.254.169.254/latest",
      "not a url",
    ]) {
      assert.throws(() => validateTarget(url), Error, url);
    }
  });

  it("returns a friendly error instead of fetching a private address", async () => {
    const result = await fetchPublicPage("http://192.168.0.1/admin");
    assert.equal(result.ok, false);
  });
});

describe("checkRateLimit", () => {
  it("allows 20 fetches per 10 minutes per IP", () => {
    const now = 1_000_000;
    for (let i = 0; i < 20; i++) assert.equal(checkRateLimit("203.0.113.9", now + i), true);
    assert.equal(checkRateLimit("203.0.113.9", now + 21), false);
    assert.equal(checkRateLimit("198.51.100.7", now + 21), true);
    assert.equal(checkRateLimit("203.0.113.9", now + 10 * 60 * 1000 + 30), true);
  });
});
