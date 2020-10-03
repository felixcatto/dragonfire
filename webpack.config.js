const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const babelConfig = require('./babelconfig.js');
const { generateScopedName } = require('./lib/devUtils');

const common = {
  entry: {
    'index.js': path.resolve(__dirname, 'client/main/index.js'),
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'dist/public/js'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelConfig.client,
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
              modules: {
                auto: true,
                getLocalIdent: ({ resourcePath }, _, localName) =>
                  generateScopedName(localName, resourcePath),
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin({ filename: '../css/index.css' })],
  stats: { warnings: false, children: false, modules: false },
};

if (process.env.ANALYZE) {
  const plugins = [new BundleAnalyzerPlugin({ openAnalyzer: false })].concat(common.plugins);
  module.exports = {
    ...common,
    mode: 'production',
    plugins,
  };
} else if (process.env.NODE_ENV === 'production') {
  module.exports = {
    ...common,
    mode: 'production',
  };
} else {
  common.entry['index.js'] = [common.entry['index.js'], 'blunt-livereload/dist/client'];

  module.exports = {
    ...common,
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
  };
}
