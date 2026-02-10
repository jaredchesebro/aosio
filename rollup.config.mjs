import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const isDev = process.env.NODE_ENV === 'dev';

const transformStyles = postcss({
  extract: 'aosio.css',
  plugins: [autoprefixer, cssnano],
  use: [['sass', { silenceDeprecations: ['legacy-js-api'] }]],
});

const input = 'src/js/aosio.js';

export default [
  // UMD build (for <script> tags)
  {
    input,
    output: {
      file: 'dist/aosio.js',
      name: 'AOS',
      format: 'umd',
      sourcemap: isDev,
    },
    plugins: [
      transformStyles,
      resolve(),
      commonjs(),
      !isDev && terser(),
      isDev &&
        serve({
          open: true,
          contentBase: ['demo', '.'],
          port: 8080,
        }),
      isDev && livereload(['dist', 'demo']),
    ].filter(Boolean),
  },
];
