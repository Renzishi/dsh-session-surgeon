import { test } from "node:test";
import assert from "node:assert/strict";
import { planRepair } from "../src/repair.mjs";
import { INSTALLED_CATALOG } from "../src/runtime.mjs";

const HEADER = { version: 0, id: "session-shim-gate", createdAt: 1, delegationDepth: 0 };

function modelSelection(seq) {
  return {
    type: "model/selection",
    seq,
    time: 10 + seq,
    data: { provider: "x", model: "y" },
  };
}

test("forward shim skips types the installed runtime already knows", () => {
  const events = [
    { type: "turn/start", seq: 0, time: 1, data: { turn: 1 } },
    modelSelection(1),
    { type: "turn/end", seq: 2, time: 3, data: { turn: 1, reason: { kind: "completed" } } },
  ];
  const decoded = {
    header: HEADER,
    headerClass: { ok: true, code: "header-ok", header: HEADER },
    events,
    health: INSTALLED_CATALOG?.has("model/selection") ? "ok" : "unknown-type",
    issues: [],
    failedFrames: 0,
    unknownTypes: INSTALLED_CATALOG?.has("model/selection") ? [] : ["model/selection"],
  };
  const plan = planRepair(decoded);
  if (INSTALLED_CATALOG?.has("model/selection")) {
    assert.ok(!plan.actions.some((a) => a.code === "forward-event-shim"));
    assert.ok(plan.events.some((e) => e.type === "model/selection" && e.ignorable === undefined));
  } else {
    assert.ok(plan.actions.some((a) => a.code === "forward-event-shim"));
  }
});
