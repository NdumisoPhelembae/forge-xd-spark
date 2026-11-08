import { describe, expect, test } from "bun:test";
import { getWordPressCategories } from "./blog";

describe("getWordPressCategories", () => {
  test("keeps every category assigned to a WordPress post", () => {
    expect(
      getWordPressCategories([
        [
          { name: "Strategy", taxonomy: "category" },
          { name: "UX & UI", taxonomy: "category" },
        ],
        [{ name: "Planning", taxonomy: "post_tag" }],
      ]),
    ).toEqual(["Strategy", "UX & UI"]);
  });
});