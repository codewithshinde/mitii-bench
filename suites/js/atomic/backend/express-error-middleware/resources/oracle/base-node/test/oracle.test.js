import { describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { errorMiddleware } from "../src/errorMiddleware.js";

function invoke(mw, err, env = {}) {
  const prev = process.env.NODE_ENV;
  if (env.NODE_ENV) process.env.NODE_ENV = env.NODE_ENV;
  const req = {};
  const res = {
    headersSent: false,
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  let passed = false;
  mw(err, req, res, () => {
    passed = true;
  });
  if (env.NODE_ENV !== undefined) process.env.NODE_ENV = prev;
  return { res, passed };
}

describe("errorMiddleware", () => {
  it("returns JSON error and status from err.statusCode", () => {
    const err = new Error("teapot");
    err.statusCode = 418;
    const { res } = invoke(errorMiddleware, err);
    assert.equal(res.statusCode, 418);
    assert.equal(res.body.error, "teapot");
    assert.equal(res.body.status, 418);
  });

  it("defaults to 500", () => {
    const { res } = invoke(errorMiddleware, new Error("x"));
    assert.equal(res.statusCode, 500);
    assert.equal(res.body.status, 500);
  });

  it("includes stack outside production", () => {
    const err = new Error("dev");
    err.stack = "STACK";
    const { res } = invoke(errorMiddleware, err, { NODE_ENV: "development" });
    assert.equal(res.body.stack, "STACK");
  });

  it("masks stack in production", () => {
    const err = new Error("prod");
    err.stack = "SECRET";
    const { res } = invoke(errorMiddleware, err, { NODE_ENV: "production" });
    assert.equal(res.body.stack, undefined);
  });
});
