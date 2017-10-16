import test from 'ava';

import { packageWalker } from '../src/package-walker';

test('walk devDependencies & dependencies', async t => {
  const names = new Set();
  await packageWalker(async (pkg, base, level) => {
    names.add(pkg.name);
    return true;
  });

  t.is(names.has('npm-package-walker'), true);
  t.is(names.has('mkdirp'), true);
});

test('walk dependencies', async t => {
  const names = new Set();
  await packageWalker(
    async (pkg, base, level) => {
      names.add(pkg.name);
      return true;
    },
    process.cwd(),
    ['dependencies']
  );

  t.is(names.has('npm-package-walker'), true);
  t.is(names.has('mkdirp'), false);
});
