const path = require('path');
const webpack = require('webpack');
const postcssPresetEnv = require('postcss-preset-env');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const childProcess = require('child_process');

// Custom Runtime Variables & Configurations

const targetBrowser = process.env.TARGET_BROWSER;
const environment = process.env.NODE_ENV;

const jsDestinationFilePath = path.join(__dirname, targetBrowser, 'dist');
const restDestinationFilePath = path.join(__dirname, targetBrowser);

const commonWebpackConfigurations = {
  mode: environment === 'production' ? 'production' : 'development',

  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  ...(environment !== 'production' && { devtool: 'cheap-module-source-map' }),
  output: {
    path: path.resolve(jsDestinationFilePath),
    filename: '[name].js',
    clean: true,
  },
  devServer: {
    static: path.resolve(jsDestinationFilePath),
  },
  optimization: {
    usedExports: true,
    minimize: environment === 'production',
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: environment === 'production',
          },
          ...(environment === 'production' && {
            format: {
              comments: environment === 'production',
              indent_level: 4,
              beautify: true,
              semicolons: true,
            },
          }),
        },
      }),
    ],
  },
};

const overallConfigurations = {
  plugins: [
    new Dotenv({
      path:
        environment === 'development'
          ? '.env.dev'
          : environment === 'production'
          ? '.env.prod'
          : '.env.test',
    }), //To read envs based on environment

    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'scripts', 'background.ts'),
          to: path.join(jsDestinationFilePath, 'background.js'),
        },
        {
          from: path.join(__dirname, 'html'),
          to: path.join(restDestinationFilePath, 'html'),
        },
        {
          from: path.join(__dirname, 'css'),
          to: path.join(restDestinationFilePath, 'css'),
        },
        {
          from: path.join(__dirname, 'assets', 'images'),
          to: path.join(restDestinationFilePath, 'assets/images'),
          globOptions: {
            ignore: ['**/node_modules/**'],
          },
        },
        {
          from: path.join(__dirname, 'manifest.json'),
          to: restDestinationFilePath,
        },
      ],
    }),
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('ZipPlugin', (compilation) => {
          const command = `zip -r ${targetBrowser}.zip ${targetBrowser}`;
          childProcess.exec(command, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error running command: ${command}`);
            }
          });
        });
      },
    },
  ],
  entry: {
    // Building JS Files
    bundle: path.resolve(__dirname, './src/screens/Popup/Index.tsx'),
    options: path.resolve(__dirname, './src/screens/Options/Index.tsx'),
    contentScript: path.resolve(__dirname, './scripts/contentScript.ts'),
  },

  resolve: {
    extensions: ['.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      components: path.resolve(__dirname, 'src/components'),
      screens: path.resolve(__dirname, 'src/screens'),
      services: path.resolve(__dirname, 'src/services'),
      hooks: path.resolve(__dirname, 'src/hooks'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'singletonStyleTag', // styleTag | singletonStyleTag | lazyStyleTag | lazySingletonStyleTag | linkTag
              attributes: {
                id: 'test-buddy',
              },
            },
          },
          {
            loader: 'css-loader',
            options: { importLoaders: 2 },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    // "autoprefixer",
                    postcssPresetEnv({
                      browsers: 'last 4 versions',
                      stage: 0,
                      autoprefixer: { grid: true },
                    }),
                  ],
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.(gif|svg|jpg|png)$/,
        loader: 'file-loader',
      },
    ],
  },
  ...commonWebpackConfigurations,
  stats: 'minimal',
};

module.exports = [overallConfigurations];
