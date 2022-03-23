const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const babelConfig = require('./babelconfig');
const { generateScopedName } = require('./lib/devUtils');

const isProduction = process.env.NODE_ENV === 'production';

const common = {
  entry: {
    index: path.resolve(__dirname, 'client/main/index.tsx'),
  },
  output: {
    filename: isProduction ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
    path: path.resolve(__dirname, 'dist/public'),
  },
  resolve: { extensions: ['.tsx', '.ts', '.js'] },
  module: {
    rules: [
      {
        test: /(\.js$|\.ts$|\.tsx)/,
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
          { loader: 'css-modules-typescript-loader' },
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
  plugins: [
    new MiniCssExtractPlugin({
      filename: isProduction ? 'css/index.[contenthash:8].css' : 'css/index.css',
    }),
    new WebpackManifestPlugin({ publicPath: '/' }),
  ],
  optimization: {
    minimizer: ['...', new CssMinimizerPlugin()],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/](.*react.*|lodash.*|formik|effector|yup|immer|date-fns)[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
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
  common.entry.index = ['blunt-livereload/dist/client', common.entry.index];

  module.exports = {
    ...common,
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
  };
}
