[![npm](https://img.shields.io/npm/v/npm-package-walker.svg)](https://www.npmjs.com/package/npm-package-walker)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/npm-package-walker.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/npm-package-walker)
[![Build Status](https://secure.travis-ci.org/arlac77/npm-package-walker.png)](http://travis-ci.org/arlac77/npm-package-walker)
[![bithound](https://www.bithound.io/github/arlac77/npm-package-walker/badges/score.svg)](https://www.bithound.io/github/arlac77/npm-package-walker)
[![codecov.io](http://codecov.io/github/arlac77/npm-package-walker/coverage.svg?branch=master)](http://codecov.io/github/arlac77/npm-package-walker?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/npm-package-walker/badge.svg)](https://coveralls.io/r/arlac77/npm-package-walker)
[![Code Climate](https://codeclimate.com/github/arlac77/npm-package-walker/badges/gpa.svg)](https://codeclimate.com/github/arlac77/npm-package-walker)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/npm-package-walker/badge.svg)](https://snyk.io/test/github/arlac77/npm-package-walker)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/npm-package-walker.svg?style=flat-square)](https://github.com/arlac77/npm-package-walker/issues)
[![Stories in Ready](https://badge.waffle.io/arlac77/npm-package-walker.svg?label=ready&title=Ready)](http://waffle.io/arlac77/npm-package-walker)
[![Dependency Status](https://david-dm.org/arlac77/npm-package-walker.svg)](https://david-dm.org/arlac77/npm-package-walker)
[![devDependency Status](https://david-dm.org/arlac77/npm-package-walker/dev-status.svg)](https://david-dm.org/arlac77/npm-package-walker#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/npm-package-walker.svg?branch=master)](http://inch-ci.org/github/arlac77/npm-package-walker)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![downloads](http://img.shields.io/npm/dm/npm-package-walker.svg?style=flat-square)](https://npmjs.org/package/npm-package-walker)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

npm-package-walker
===
walks the local npm package tree and calls a visitor function


<!-- skip-example -->
```js
import { packageWalker } from 'package-walker';

async function collectPackageNames() {
  const names = new Set();

  await packageWalker(
    process.cwd(),
    (pkg, base, level) => {
      names.add(pkg.name);
      return true;
    },
    ['dependencies']
  );

  return names;
}

collectPackageNames().then(names => console.log(names));
```


# install

With [npm](http://npmjs.org) do:

```shell
npm install package-walker
```

# license

BSD-2-Clause
