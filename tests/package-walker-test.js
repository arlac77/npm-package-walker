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

  //console.log(JSON.stringify(Array.from(names), undefined, 2));

  t.deepEqual(
    Array.from(names).sort(),
    [
      'npm-package-walker',
      'ava',
      'jsdoc-babel',
      'jsdoc-to-markdown',
      'markdown-doctest',
      'nyc',
      'rollup',
      'semantic-release',
      'xo',
      'babel-preset-env',
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
      'yargs-parser',
      'execa',
      'debug',
      'get-stdin',
      'resolve-cwd',
      'supports-color',
      'cliui',
      'camelcase',
      'string-width'
    ].sort()
  );
});
