import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

test("sidebar-collapse CSS matches dsh-better-sidebar's body attribute (#4/#5)", async () => {
  const css = await readFile(join(ROOT, "plugin", "ui.css"), "utf8");
  assert.ok(css.includes("body[data-dsh-sidebar-collapsed]"));
  assert.ok(!css.includes("[data-dsh-frame][data-sidebar-collapsed]"));
});
