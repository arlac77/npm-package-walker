import { promisify } from "util";
import { join } from "path";
import { exists, readFile } from "fs";

const asyncExists = promisify(exists);
const asyncReadFile = promisify(readFile);

/**
 * dependency types used by default
 * - dependencies
 * - devDependencies
 * - optionalDependencies
 * - peerDependencies
 */
export const defaultDependencyTypes = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies"
];

/**
 * @callback packageVisitor
 * @param {Object} package package.json content
 * @param {string} directory package base dir
 * @param {number} nestingLevel how deep in the dependency tree are we
 * @return {Promise<boolean>} true to continue traversing dependencies of this package
 */

/**
 * Walks the local package dependency tree and calls a visitor function.
 * The visitor function recives the decoded package.json, its directory, and the nesting level starting with 0 for the base package.
 * Descending the dependency tree continues until the visitor function returns false or no more dependencies
 * are declared in a package.
 * @param {packageVisitor} visitor async to be called for each package
 * @param {string} base directory where to start crawling package.json
 * @param {string[]} dependencyTypes dig into dependency dev and/or prod
 * @return {Promise<boolean>} when resolving to true further dig into the dependencies
 */
export async function packageWalker(
  visitor,
  base = process.cwd(),
  dependencyTypes = defaultDependencyTypes
) {
  const seenBefore = new Set();

  function modulePath(packagePath) {
    return packagePath.reduce((acc, cur) => {
      acc.push("node_modules", cur);
      return acc;
    }, []);
  }

  async function walker(packagePath) {
    while (true) {
      const dir = join(base, ...modulePath(packagePath));

      if (seenBefore.has(dir)) {
        return;
      }

      seenBefore.add(dir);

      const pp = join(dir, "package.json");

      if (await asyncExists(pp)) {
        const pkg = JSON.parse(await asyncReadFile(pp, { encoding: "utf8" }));

        if (await visitor(pkg, dir, packagePath.length)) {
          return Promise.all(
            (packagePath.length > 0 ? ["dependencies"] : dependencyTypes)
              .map(dt => (pkg[dt] ? Object.keys(pkg[dt]) : []))
              .reduce((acc, val) => {
                acc.push(...val);
                return acc;
              }, [])
              .map(d => walker([...packagePath, d]))
          );
        }

        return;
      }
      packagePath.pop();
    }
  }
  return walker([]);
}
