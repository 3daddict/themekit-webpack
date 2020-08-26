const path = require('path');
const glob = require("glob");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';


module.exports = {
    mode: mode,
    entry: {
        'layout': glob.sync('./src/components/layout/**/*.js'),
        'sections': glob.sync('./src/components/sections/**/*.js'),
        'snippets': glob.sync('./src/components/snippets/**/*.js'),
    },
    output: {
        filename: './assets/bundle.[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimizer: [
            new TerserPlugin(),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'common',
                    chunks: 'all'
                }
            }
        }
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
                    'src/components/templates/customers/*',
                    'src/components/snippets/**/*'
                ]
            },
            {
                from: 'src/components/templates/customers/*.liquid',
                to: 'templates/[folder]/[name].[ext]',
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
                from: 'src/locals/*.json',
                to: 'locals/[name].[ext]',
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