const fs = require('fs');
const { join } = require('path');
const { promisify } = require('util');
const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);

/**
@module 'npm-package-walker'
*/

/**
* Walks the local package dependency tree and calls a visitor function
* @param {string} base directory where to start crawling package.json
* @param {function(object,string,number)} visitor to be called for each package
* @param {string[]} dependencyTypes branch for dependency dev and/or prod defaults to dependencies and devDependencies
* @param {number} level dependency nesting level statung with 0
*/
export async function packageWalker(
  base,
  visitor,
  dependencyTypes = ['dependencies', 'devDependencies'],
  level = 0
) {
  const pp = join(base, 'package.json');
  if (await exists(pp)) {
    const pkg = JSON.parse(await readFile(pp, { encoding: 'utf8' }));

    if (visitor(pkg, base, level)) {
      return Promise.all(
        dependencyTypes
          .map(dt => (pkg[dt] ? Object.keys(pkg[dt]) : []))
          .reduce((acc, val) => {
            acc.push(...val);
            return acc;
          }, [])
          .map(d =>
            packageWalker(
              join(base, 'node_modules', d),
              visitor,
              dependencyTypes,
              level + 1
            )
          )
      );
    }
  }
}
