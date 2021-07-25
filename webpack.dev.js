const { merge } = require('we' + 'bpack-merge');
const glob = require('glob');
const common = require('./webpack.common.js');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const { transformLiquid } = require('./shopify-dev-utils/transformLiquid');

const port = 9000;
const publicPath = `https://localhost:${port}/`;

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: glob.sync('./src/components/**/*.js').reduce(
        (acc, path) => {
            const entry = path.replace(/^.*[\\\/]/, '').replace('.js', '');
            acc[entry] = path;
            return acc;
        },
        { liquidDev: './shopify-dev-utils/liquidDev.entry.js' }
    ),
    output: {
        filename: 'assets/bundle.[name].js',
        hotUpdateChunkFilename: 'hot/[id].[fullhash].hot-update.js',
        hotUpdateMainFilename: 'hot/[fullhash].hot-update.json',
        path: path.resolve(__dirname, 'dist'),
        publicPath,
    },
    cache: false,
    module: {
        rules: [
            {
                test: /\.liquid$/,
                use: [
                    { loader: 'raw-loader', options: { esModule: false } },
                    {
                        loader: path.resolve(__dirname, 'shopify-dev-utils/liquidDev.loader.js'),
                        options: {
                            publicPath,
                            isSection(liquidPath) {
                                const diff = path.relative(
                                    path.join(__dirname, './src/components/'),
                                    liquidPath
                                );
                                const componentType = diff.split(path.sep).shift();
                                return componentType === 'sections';
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(sc|sa|c)ss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                        },
                    },
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new WebpackShellPluginNext({
            onBuildStart: {
                scripts: [
                    'echo -- Webpack build started 🛠',
                    'shopify-themekit watch --env=development',
                ],
                blocking: false,
                parallel: true,
            },
            onBuildError: {
                scripts: ['echo -- ☠️ Aw snap, Webpack build failed...'],
            },
            onBuildEnd: {
                scripts: [
                    'echo -- Webpack build complete ✓',
                    'echo -- Deploying to theme ✈️',
                    'shopify-themekit deploy --env=development',
                    'echo -- Deployment competed ✓',
                    'shopify-themekit open',
                ],
                blocking: true,
                parallel: false,
            },
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/components/**/*.liquid',
                    to: '[folder]/[name].[ext]',
                    flatten: true,
                    transformPath(targetPath, absolutePath) {
                        const relativePath = path.join(__dirname, 'src/components');
                        const diff = path.relative(relativePath, absolutePath);
                        const targetFolder = diff.split(path.sep)[0];
                        return path.join(targetFolder, path.basename(absolutePath));
                    },
                    transform: transformLiquid(publicPath),
                },
            ],
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        publicPath: '/',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        },
        compress: true,
        port,
        https: true,
        disableHostCheck: true,
        hot: true,
        overlay: true,
        writeToDisk: true,
    },
});
