import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getWordPressCategories } from "./blog";

describe("getWordPressCategories", () => {
  it("keeps every category assigned to a WordPress post", () => {
    assert.deepEqual(
      getWordPressCategories([
        [
          { name: "Strategy", taxonomy: "category" },
          { name: "UX & UI", taxonomy: "category" },
        ],
        [{ name: "Planning", taxonomy: "post_tag" }],
      ]),
      ["Strategy", "UX & UI"],
    );
  });
});