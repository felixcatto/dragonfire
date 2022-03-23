const { generateScopedName, preprocessCss } = require('./lib/devUtils');

module.exports = {
  client: {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: {
            browsers: [
              'last 2 Chrome versions',
              'last 2 Edge versions',
              'last 2 Firefox versions',
              'last 2 Safari versions',
            ],
          },
        },
      ],
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
  },

  server: {
    presets: [
      [
        '@babel/env',
        {
          targets: {
            node: true,
          },
        },
      ],
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],

    plugins: [
      [
        'css-modules-transform',
        {
          generateScopedName,
          preprocessCss,
          extensions: ['.scss'],
          devMode: true,
        },
      ],
    ],

    env: { development: { plugins: ['source-map-support'] } },
  },
};
