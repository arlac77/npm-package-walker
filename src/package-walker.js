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
* The visitor function recives the decoded package.json, its directory, and the nesting level starting with 0 for the base package.
* Descending the dependency tree continues until the visitor function returns false or no more dependencies
* are declared in a package.
* @param {function(Object,string,number)} visitor async to be called for each package
* @param {string} [base=process.cwd()] directory where to start crawling package.json
* @param {string[]} [dependencyTypes=['dependencies', 'devDependencies']] dig into dependency dev and/or prod
*/
export async function packageWalker(
  visitor,
  base = process.cwd(),
  dependencyTypes = ['dependencies', 'devDependencies']
) {
  async function walker(base, level) {
    const pp = join(base, 'package.json');

    if (await exists(pp)) {
      const pkg = JSON.parse(await readFile(pp, { encoding: 'utf8' }));

      if (await visitor(pkg, base, level)) {
        return Promise.all(
          (level > 0 ? ['dependencies'] : dependencyTypes)
            .map(dt => (pkg[dt] ? Object.keys(pkg[dt]) : []))
            .reduce((acc, val) => {
              acc.push(...val);
              return acc;
            }, [])
            .map(d => walker(join(base, 'node_modules', d), level + 1))
        );
      }
    } /*else {
      let parts = base.split('/');
      parts.splice(parts.length - 4, 2);
      console.log(pp);
      console.log('>' + join(...parts));
    }*/
  }

  return walker(base, 0);
}
