import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  findCharacter,
  listCharacters,
  pickBuild,
  suggestCharacters,
} from "../src/lookup.js";

describe("findCharacter", () => {
  it("resolves by id", () => {
    assert.equal(findCharacter("batman")?.name, "Batman");
  });

  it("resolves by alias", () => {
    assert.equal(findCharacter("ww")?.id, "wonder-woman");
    assert.equal(findCharacter("bats")?.id, "batman");
  });

  it("is case-insensitive", () => {
    assert.equal(findCharacter("Wonder Woman")?.id, "wonder-woman");
  });

  it("returns undefined for unknown names", () => {
    assert.equal(findCharacter("superman"), undefined);
  });
});

describe("pickBuild", () => {
  it("picks highest priority when mode omitted", () => {
    const batman = findCharacter("batman");
    assert.ok(batman);
    const result = pickBuild(batman);
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.build.id, "raid");
  });

  it("picks explicit mode", () => {
    const batman = findCharacter("batman");
    assert.ok(batman);
    const result = pickBuild(batman, "arena");
    assert.equal(result.ok, true);
    if (result.ok) assert.equal(result.build.id, "arena");
  });

  it("errors on unknown mode", () => {
    const batman = findCharacter("batman");
    assert.ok(batman);
    const result = pickBuild(batman, "story");
    assert.deepEqual(result, { ok: false, reason: "unknown_mode" });
  });
});

describe("list and suggest", () => {
  it("lists characters", () => {
    const list = listCharacters();
    assert.ok(list.length >= 2);
    assert.ok(list.some((c) => c.id === "batman"));
  });

  it("suggests close matches", () => {
    const suggestions = suggestCharacters("bat");
    assert.ok(suggestions.some((s) => s.id === "batman"));
  });
});
