import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const isDev = process.env.NODE_ENV === 'dev';

const transformStyles = postcss({
  extract: 'aosio.css',
  plugins: [autoprefixer, !isDev && cssnano].filter(Boolean),
  use: [['sass', { silenceDeprecations: ['legacy-js-api'] }]],
});

export default [
  // UMD build (for <script> tags)
  {
    input: 'src/js/aosio.js',
    output: {
      file: 'dist/aosio.js',
      name: 'AOS',
      format: 'umd',
      sourcemap: isDev,
    },
    plugins: [
      transformStyles,
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

  // ESM build (for bundlers / import)
  {
    input: 'src/js/aosio-core.js',
    output: {
      file: 'dist/aosio.esm.js',
      format: 'es',
      sourcemap: isDev,
    },
    plugins: [!isDev && terser()].filter(Boolean),
  },
];
