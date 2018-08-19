import executable from 'rollup-plugin-executable';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import pkg from './package.json';

export default [
  {
    input: pkg.module,
    output: {
      file: pkg.main,
      format: 'cjs',
      interop: false
    },
    plugins: [resolve(), commonjs(), cleanup()],
    external: ['fs', 'util', 'path']
  }
];
