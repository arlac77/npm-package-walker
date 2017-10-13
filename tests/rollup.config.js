export default {
  input: 'tests/package-walker-test.js',
  output: {
    file: 'build/package-walker-test.js',
    format: 'cjs',
    sourcemap: true
  },
  external: ['ava']
};
