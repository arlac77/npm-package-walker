import test from "ava";

import { packageWalker } from "../src/package-walker.mjs";

test("walk terminate early", async t => {
  const names = new Set();
  await packageWalker(async pkg => {
    names.add(pkg.name);
    return false;
  });

  t.true(names.has("npm-package-walker"));
  t.false(names.has("rollup"));
});

test("walk with exception", async t => {
  const names = new Set();

  await t.throwsAsync(
    async () =>
      packageWalker(async pkg => {
        names.add(pkg.name);
        throw new Error(`something went wrong`);
        return false;
      }),
    Error,
    "something went wrong"
  );
});

test("walk devDependencies & dependencies", async t => {
  const names = new Set();
  await packageWalker(async pkg => {
    names.add(pkg.name);
    return true;
  });

  t.true(names.has("npm-package-walker"));
});

test("walk dependencies", async t => {
  const names = new Set();
  await packageWalker(
    async pkg => {
      names.add(pkg.name);
      return true;
    },
    process.cwd(),
    ["dependencies"]
  );

  t.true(names.has("npm-package-walker"));
  t.false(names.has("rollup"));
});

test("walk devDependencies", async t => {
  const detected = new Map();
  await packageWalker(
    async (pkg, base, p) => {
      detected.set(p.join(":"), pkg.name);
      return true;
    },
    process.cwd(),
    ["devDependencies"]
  );

  const expected = {
    "": {},
    ava: {},
    "markdown-doctest": {},
    "semantic-release": {},
    documentation: {},
    "documentation:fsevents:glob": {},
    "npm:camelcase": {}
  };

  t.log(detected);

  Object.keys(expected).forEach(e => {
    t.true(detected.get(e) !== undefined, `${e}`);
  });
});
