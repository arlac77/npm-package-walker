import test from 'ava';

import { packageWalker } from '../src/package-walker';

test('walk terminate early', async t => {
  const names = new Set();
  await packageWalker(async pkg => {
    names.add(pkg.name);
    return false;
  });

  t.is(names.has('npm-package-walker'), true);
  t.is(names.has('rollup'), false);
});

test('walk devDependencies & dependencies', async t => {
  const names = new Set();
  await packageWalker(async pkg => {
    names.add(pkg.name);
    return true;
  });

  t.is(names.has('npm-package-walker'), true);
  t.is(names.has('rollup'), true);
});

test('walk dependencies', async t => {
  const names = new Set();
  await packageWalker(
    async pkg => {
      names.add(pkg.name);
      return true;
    },
    process.cwd(),
    ['dependencies']
  );

  t.is(names.has('npm-package-walker'), true);
  t.is(names.has('rollup'), false);
});

test('walk devDependencies', async t => {
  const detected = new Map();
  await packageWalker(
    async (pkg, base, level) => {
      detected.set(pkg.name, level);
      return true;
    },
    process.cwd(),
    ['devDependencies']
  );

  const expected = {
    'npm-package-walker': 0,
    ava: 1,
    nyc: 1,
    rollup: 1,
    'markdown-doctest': 1,
    'semantic-release': 1,
    documentation: 1,
    'travis-deploy-once': 1,
    glob: 2,
    camelcase: 3
  };

  Object.keys(expected).forEach(e => {
    t.is(detected.get(e), expected[e], `${e}:${expected[e]}`);
  });
});
