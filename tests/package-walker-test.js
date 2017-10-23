import test from 'ava';

import { packageWalker } from '../src/package-walker';

test('walk devDependencies & dependencies', async t => {
  const names = new Set();
  await packageWalker(async pkg => {
    names.add(pkg.name);
    return true;
  });

  t.is(names.has('npm-package-walker'), true);
  t.is(names.has('mkdirp'), true);
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
  t.is(names.has('mkdirp'), false);
});

test('walk devDependencies', async t => {
  const names = new Set();
  await packageWalker(
    async pkg => {
      names.add(pkg.name);
      return true;
    },
    process.cwd(),
    ['devDependencies']
  );

  t.deepEqual(
    Array.from(names).sort(),
    [
      'npm-package-walker',
      'ava',
      'jsdoc-to-markdown',
      'jsdoc-babel',
      'markdown-doctest',
      'nyc',
      'rollup',
      'semantic-release',
      'xo',
      'chalk',
      'archy',
      'arrify',
      'caching-transform',
      'convert-source-map',
      'debug-log',
      'default-require-extensions',
      'find-cache-dir',
      'find-up',
      'foreground-child',
      'glob',
      'istanbul-lib-coverage',
      'istanbul-lib-hook',
      'istanbul-lib-instrument',
      'istanbul-lib-report',
      'istanbul-lib-source-maps',
      'istanbul-reports',
      'md5-hex',
      'merge-source-map',
      'micromatch',
      'mkdirp',
      'resolve-from',
      'rimraf',
      'signal-exit',
      'spawn-wrap',
      'test-exclude',
      'yargs',
      'execa',
      'yargs-parser',
      'nopt',
      'get-stdin',
      'resolve-cwd',
      'supports-color',
      'debug',
      'cliui',
      'camelcase',
      'string-width'
    ].sort()
  );
});
