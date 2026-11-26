import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  findCharacter,
  listCharacters,
  pickBuild,
  suggestCharacters,
} from "../src/lookup.js";

describe("findCharacter", () => {
  it("resolves by id / abbr", () => {
    assert.equal(findCharacter("jlb")?.name, "Justice League Batman");
    assert.equal(findCharacter("akbm")?.name, "Arkham Knight Batman");
  });

  it("resolves by alias", () => {
    assert.equal(findCharacter("jls")?.id, "jlsm");
    assert.equal(findCharacter("darkside")?.id, "ds");
  });

  it("is case-insensitive", () => {
    assert.equal(findCharacter("Justice League Batman")?.id, "jlb");
  });

  it("returns undefined for unknown names", () => {
    assert.equal(findCharacter("not-a-real-hero"), undefined);
  });
});

describe("pickBuild", () => {
  it("picks default empty stub when mode omitted", () => {
    const jlb = findCharacter("jlb");
    assert.ok(jlb);
    const result = pickBuild(jlb);
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.build.id, "default");
  });

  it("errors on unknown mode", () => {
    const jlb = findCharacter("jlb");
    assert.ok(jlb);
    const result = pickBuild(jlb, "arena");
    assert.deepEqual(result, { ok: false, reason: "unknown_mode" });
  });
});

describe("list and suggest", () => {
  it("lists the full roster", () => {
    const list = listCharacters();
    assert.ok(list.length >= 100);
    assert.ok(list.some((c) => c.id === "jlb"));
    assert.ok(list.some((c) => c.id === "svbm"));
  });

  it("suggests close matches", () => {
    const suggestions = suggestCharacters("batman");
    assert.ok(suggestions.some((s) => s.id.includes("bm") || s.name.toLowerCase().includes("batman")));
  });
});
