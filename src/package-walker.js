const fs = require('fs');
const { join } = require('path');
const { promisify } = require('util');
const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);

/**
* @module 'npm-package-walker'
*/

/**
* Walks the local package dependency tree and calls a visitor function.
* Descending the dependency tree continues until the visitor function returns false or no more dependencies
* are declared in a package.
* @param {function(object,string,number)} visitor async to be called for each package
* @param {string} [base=process.cwd()] directory where to start crawling package.json
* @param {string[]} [dependencyTypes=['dependencies', 'devDependencies']] dig into dependency dev and/or prod
* @param {number} [level=0] dependency nesting level
*/
export async function packageWalker(
  visitor,
  base = process.cwd(),
  dependencyTypes = ['dependencies', 'devDependencies'],
  level = 0
) {
  const pp = join(base, 'package.json');
  if (await exists(pp)) {
    const pkg = JSON.parse(await readFile(pp, { encoding: 'utf8' }));

    if (await visitor(pkg, base, level)) {
      return Promise.all(
        dependencyTypes
          .map(dt => (pkg[dt] ? Object.keys(pkg[dt]) : []))
          .reduce((acc, val) => {
            acc.push(...val);
            return acc;
          }, [])
          .map(d =>
            packageWalker(
              visitor,
              join(base, 'node_modules', d),
              dependencyTypes,
              level + 1
            )
          )
      );
    }
  }
}
