import terser from '@rollup/plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'index.js',
      format: 'module'
    }
  ],
  plugins: [
    resolve(),
    // terser(),
    replace({
    preventAssignment: true,
      values: {
        'process.env.NODE_ENV': '"production"'
      }
    })
  ]
}
