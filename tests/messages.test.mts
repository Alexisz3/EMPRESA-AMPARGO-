import assert from "node:assert/strict";
import test from "node:test";

import en from "../src/messages/en.json" with { type: "json" };
import es from "../src/messages/es.json" with { type: "json" };

type MessageTree = { [key: string]: string | string[] | MessageTree };

/**
 * A key present in one locale and missing in the other throws at render time
 * in that locale, and a key that exists but is never read is how the Spanish
 * homepage came to ship an English headline. Both failures are invisible in
 * the component source, so they are asserted here instead.
 */
function flatten(tree: MessageTree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = `${prefix}${key}`;
    if (Array.isArray(value)) return [path];
    return typeof value === "object" && value !== null
      ? flatten(value, `${path}.`)
      : [path];
  });
}

function collect(tree: MessageTree, prefix = ""): Map<string, unknown> {
  const entries = new Map<string, unknown>();
  for (const [key, value] of Object.entries(tree)) {
    const path = `${prefix}${key}`;
    if (!Array.isArray(value) && typeof value === "object" && value !== null) {
      for (const [nested, nestedValue] of collect(value, `${path}.`)) {
        entries.set(nested, nestedValue);
      }
    } else {
      entries.set(path, value);
    }
  }
  return entries;
}

const enKeys = flatten(en as MessageTree);
const esKeys = flatten(es as MessageTree);

test("English and Spanish message files declare the same keys", () => {
  const missingInSpanish = enKeys.filter((key) => !esKeys.includes(key));
  const missingInEnglish = esKeys.filter((key) => !enKeys.includes(key));

  assert.deepEqual(missingInSpanish, [], "keys present in en.json but missing from es.json");
  assert.deepEqual(missingInEnglish, [], "keys present in es.json but missing from en.json");
});

test("no message is left empty", () => {
  for (const [locale, entries] of [["en", collect(en as MessageTree)], ["es", collect(es as MessageTree)]] as const) {
    for (const [key, value] of entries) {
      const values = Array.isArray(value) ? value : [value];
      for (const item of values) {
        assert.equal(typeof item, "string", `${locale}: ${key} should resolve to a string`);
        assert.notEqual((item as string).trim(), "", `${locale}: ${key} is empty`);
      }
    }
  }
});

test("array messages have the same length in both locales", () => {
  const enEntries = collect(en as MessageTree);
  const esEntries = collect(es as MessageTree);

  for (const [key, value] of enEntries) {
    if (!Array.isArray(value)) continue;
    const counterpart = esEntries.get(key);
    assert.ok(Array.isArray(counterpart), `${key} should also be an array in es.json`);
    assert.equal(
      (counterpart as string[]).length,
      value.length,
      `${key} has ${value.length} entries in en.json but ${(counterpart as string[]).length} in es.json`,
    );
  }
});

test("the Spanish hero headline is not the English one", () => {
  // Regression guard for the hardcoded-headline bug: es.json must not simply
  // repeat the English wording, which is what a copy-paste stub looks like.
  const enHero = collect(en as MessageTree);
  const esHero = collect(es as MessageTree);

  for (const key of ["Hero.titleLines.lead", "Hero.titleLines.trail"]) {
    const source = enHero.get(key) as string[] | undefined;
    const translated = esHero.get(key) as string[] | undefined;
    assert.ok(source && translated, `${key} should exist in both locales`);
    assert.notDeepEqual(translated, source, `${key} is untranslated in es.json`);
  }
});
