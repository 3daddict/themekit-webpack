const path = require('path');
const glob = require("glob");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';
const stats = mode === 'development' ? 'errors-warnings' : { children: false };


module.exports = {
    mode: mode,
    stats: stats,
    entry: glob.sync('./src/components/**/*.js').reduce((acc, path) => {
        const entry = path.replace(/^.*[\\\/]/, '').replace('.js','');
        acc[entry] = path;
        return acc;
      }, {}),
    output: {
        filename: './assets/bundle.[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: 'disabled',
            generateStatsFile: true
        }),
        new MiniCssExtractPlugin({
            filename: '/assets/bundle.[name].css'
        }),
        new CopyPlugin([{
                from: 'src/components/**/*',
                to: '[folder]/[name].[ext]',
                ignore: [
                    'src/components/**/*.js',
                    'src/components/**/*.scss',
                    'src/assets/**/*',
                    'src/components/sections/**/*',
                    'src/components/templates/**/*', //! Templates folder was missing.
                    'src/components/snippets/**/*'
                ]
            },
            {
                from: 'src/components/templates/**/*.liquid',
                to: 'templates/[name].[ext]', //! Templates folder was missing.
                flatten: true
            },            
            {
                from: 'src/components/sections/**/*.liquid',
                to: 'sections/[name].[ext]',
                flatten: true
            },
            {
                from: 'src/components/snippets/**/*.liquid',
                to: 'snippets/[name].[ext]',
                flatten: true
            },
            {
                from: 'src/assets/**/*',
                to: 'assets/',
                flatten: true
            },
            {
                from: 'src/config/*.json',
                to: 'config/[name].[ext]',
            },
            {
                from: 'src/locales/*.json', // !Fixed wrong path.  
                to: 'locales/[name].[ext]', // !Fixed wrong path. 
            },
        ])
    ],
    module: {
        rules: [{
                test: /\.(sc|sa|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false
                        }
                    },
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['transform-class-properties'],
                        plugins: ['babel-plugin-transform-class-properties']
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    }
};

// Run Shell commmands during Webpack operations
if (mode === 'development') {
    module.exports.plugins.push(
      new WebpackShellPluginNext({
        onBuildStart:{
          scripts: ['echo -- Webpack build started 🛠'],
          blocking: true,
          parallel: false
        },
        onBuildError:{
            scripts: ['echo -- ☠️ Aw snap, Webpack build failed...'],
        }, 
        onBuildEnd:{
          scripts: [
              'echo -- Webpack build complete ✓',
              'echo -- Deploying to theme ✈️',
              'shopify-themekit deploy',
              'echo -- Deployment competed ✓',
              'shopify-themekit open',
              'shopify-themekit watch'],
          blocking: true,
          parallel: false
        }
      })
    )
  }
