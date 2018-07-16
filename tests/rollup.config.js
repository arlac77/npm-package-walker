import istanbul from 'rollup-plugin-istanbul';

import multiEntry from 'rollup-plugin-multi-entry';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
export default {
  input: 'tests/package-walker-test.js',
  output: {
    file: 'build/package-walker-test.js',
    format: 'cjs',
    sourcemap: true
  },
  external: ['ava', 'path', 'fs', 'util']
};
