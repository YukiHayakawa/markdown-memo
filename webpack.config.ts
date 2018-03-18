import * as path from 'path';
import * as webpack from 'webpack';
import * as autoprefixer from 'autoprefixer';
import * as ProgressBarPlugin from 'progress-bar-webpack-plugin';
import * as stylelint from 'stylelint';
import * as postcssImport from 'postcss-import';
import * as postcssNested from 'postcss-nested';

const PORT = 8088;

interface Config extends webpack.Configuration {
  module: {
    rules: NewUseRule[],
  };
}
interface NewUseRule extends webpack.NewUseRule {
  use: webpack.NewLoader | webpack.NewLoader[];
}

const rules: NewUseRule[] = [
  {
    enforce: 'pre',
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'tslint-loader',
      options: {
        quiet: true,
        failOnError: false,
        failOnWarning: false,
        emitError: true,
        emitWarning: true,
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'ts-loader',
    },
  },
  {
    enforce: 'pre',
    exclude: /node_modules/,
    test: /\.js$/,
    use: {
      loader: 'source-map-loader',
    },
  },
  {
    test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [
      {
        loader: 'url-loader',
      },
    ],
  },
  {
    test: /\.css$/,
    use: [
      {
        loader: 'style-loader',
      },
      {
        loader: 'css-loader',
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: (): any => [
            stylelint(),
            postcssImport(),
            autoprefixer({
              browsers: ['last 2 versions', 'android >= 4'],
            }),
            postcssNested,
          ],
          sourceMap: true,
        },
      },
    ],
  },
];
const config: Config = {
  context: path.resolve(__dirname, 'client/'),
  entry: [
    `webpack-dev-server/client?http://localhost:${PORT}`,
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    'babel-polyfill',
    './js/index.tsx',
    './css/style.css',
  ],
  output: {
    filename: 'index.min.js',
    path: path.resolve(__dirname, 'public/assets/dist'),
    publicPath: `http://localhost:${PORT}/assets/dist/`,
  },
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.css'],
    alias: {
      js: path.join(__dirname, 'client/js'),
      css: path.join(__dirname, 'client/css'),
      config: path.join(__dirname, 'config'),
    },
  },
  // ソースマップを有効にする
  devtool: 'inline-source-map',
  devServer: {
    hot: true,
    port: PORT,
    inline: true,
    compress: true,
    contentBase: path.join(__dirname, 'public'),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ProgressBarPlugin(),
  ],
  cache: true,
};

export default config;
