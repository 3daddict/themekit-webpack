const path = require('path');
const glob = require('glob');
const { argv } = require('yargs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const ESLintPlugin = require('eslint-webpack-plugin');
const { transformLiquid } = require('./shopify-dev-utils/transformLiquid');

const isDevMode = argv.mode === 'development';
const stats = isDevMode ? 'errors-warnings' : { children: false };
const port = 9000;
const publicPath = isDevMode ? `https://localhost:${port}/` : '';

module.exports = {
    stats: stats,
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
    optimization: {
        runtimeChunk: { name: 'runtime' },
    },
    module: {
        rules: [
            isDevMode && {
                test: /\.liquid$/,
                use: [
                    'string-loader',
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
                test: /\.liquid$/,
                use: [
                    'string-loader',
                    {
                        loader: path.resolve(__dirname, 'shopify-dev-utils/liquidDev.loader.js'),
                        options: {
                            publicPath,
                            isSection(liquidPath) {
                                const diff = path.relative(path.join(__dirname, './src/components/'), liquidPath);
                                const componentType = diff.split(path.sep).shift();
                                return componentType === 'sections';
                            }
                        },
                    },
                ],
            },
            {
                test: /\.(sc|sa|c)ss$/,
                use: [
                    isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
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
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader'],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
        ].filter(Boolean),
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new ESLintPlugin({
            fix: true,
        }),
        isDevMode &&
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
                        'echo -- Building TailwindCSS...',
                        'npx tailwindcss build src/components/tailwind.css -o dist/assets/tailwind.css.liquid',
                        'echo -- Minifying TailwindCSS',
                        'cleancss -o dist/assets/tailwind.min.css.liquid dist/assets/tailwind.css.liquid',
                        'echo -- Deploying to theme ✈️',
                        'shopify-themekit deploy --env=development',
                        'echo -- Deployment competed ✓',
                        'shopify-themekit open',
                    ],
                    blocking: true,
                    parallel: false,
                },
            }),
        new MiniCssExtractPlugin({
            filename: './assets/bundle.[name].css',
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
                    transform: isDevMode ? transformLiquid(publicPath) : undefined,
                },
                {
                    from: 'src/assets/**/*',
                    to: 'assets/',
                    flatten: true,
                },
                {
                    from: 'src/config/*.json',
                    to: 'config/[name].[ext]',
                },
                {
                    from: 'src/locales/*.json',
                    to: 'locales/[name].[ext]',
                },
            ],
        }),
    ].filter(Boolean),
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
};
