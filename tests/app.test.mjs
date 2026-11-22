// node --test tests/*.mjs   (no dependencies)
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const read = name => readFileSync(new URL(`../${name}`, import.meta.url), "utf8");
const box = { window: {} };
vm.runInNewContext(read("config.js"), box);
const C = box.window.FIELD_LOGGER_CONFIG;
const html = read("index.html");

test("every configuration key the app reads is defined", () => {
  const block = html.match(/const \{([^}]+)\} = window\.FIELD_LOGGER_CONFIG/)[1];
  for (const key of block.split(",").map(k => k.trim()).filter(Boolean)) assert.ok(key in C, key);
});

test("every line joins two different areas that exist", () => {
  const ids = new Set(C.DEFAULT_GEO.zones.map(z => z.id));
  for (const l of C.DEFAULT_GEO.lines) {
    assert.ok(ids.has(l.zones[0]) && ids.has(l.zones[1]), l.name);
    assert.notEqual(l.zones[0], l.zones[1], l.name);
  }
});

test("the route uses lines that connect its steps, with one stop per pause", () => {
  const { zones, lines } = C.DEFAULT_GEO;
  const id = name => zones.find(z => z.name === name).id;
  let at = C.WALK.forward.start;
  for (const step of C.WALK.forward.steps) {
    const between = lines.filter(l => l.zones.includes(id(at)) && l.zones.includes(id(step.zone)));
    assert.ok(between.some(l => (step.door ? l.name === step.door : l.type === "open")), `${at} to ${step.zone}`);
    at = step.zone;
  }
  assert.deepEqual(Array.from(C.WALK.forward.stops, s => s.zone), Array.from(C.WALK.forward.steps.filter(s => s.pause), s => s.zone));
});

test("every role has tasks and the example code is valid", () => {
  for (const role of C.ROLES) assert.ok(C.TASKS[role.id].length, role.id);
  assert.match(C.CODE_EXAMPLE, new RegExp(C.CODE_PATTERN));
});

test("no function is declared twice", () => {
  const names = [...html.matchAll(/^(?:async )?function (\w+)/gm)].map(m => m[1]);
  assert.equal(new Set(names).size, names.length);
});

test("the app loads nothing from other hosts", () => {
  assert.doesNotMatch(html, /(?:src|href)="https?:|url\(["']?https?:|fetch\(/);
});

test("the service worker caches every app file", () => {
  const sw = read("sw.js");
  for (const file of ["index.html", "config.js", "manifest.webmanifest"]) assert.ok(sw.includes(`./${file}`), file);
});
