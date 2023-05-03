import babel from 'rollup-plugin-babel'

export default {
  input: './src/index.js',
  output: {
    format: 'umd',
    name: 'Vue', // input需要有默认导出
    file: 'dist/vue.js',
    sourcemap: true    // 源码映射
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'  // glob语法
    })
  ]
}
