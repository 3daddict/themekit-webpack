const path = require('path');
const glob = require('glob');
const { argv } = require('yargs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const isDev = argv.mode === 'development';
const stats = isDev ? 'errors-warnings' : { children: false };

module.exports = {
    stats: stats,
    entry: glob.sync('./src/components/**/*.js').reduce((acc, path) => {
        const entry = path.replace(/^.*[\\\/]/, '').replace('.js', '');
        acc[entry] = path;
        return acc;
    }, {}),
    output: {
        filename: './assets/bundle.[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.(sc|sa|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
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
                loader: 'babel-loader',
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        isDev &&
            new BundleAnalyzerPlugin({
                analyzerMode: 'disabled',
                generateStatsFile: true,
            }),
        isDev &&
            new WebpackShellPluginNext({
                onBuildStart: {
                    scripts: ['echo -- Webpack build started 🛠'],
                    blocking: true,
                    parallel: false,
                },
                onBuildError: {
                    scripts: ['echo -- ☠️ Aw snap, Webpack build failed...'],
                },
                onBuildEnd: {
                    scripts: [
                        'echo -- Webpack build complete ✓',
                        'echo -- Building TailwindCSS...',
                        'npx tailwindcss build src/components/tailwind.css -o dist/assets/tailwind.css.liquid',
                        'echo -- Deploying to theme ✈️',
                        'shopify-themekit deploy',
                        'echo -- Deployment competed ✓',
                        'shopify-themekit open',
                        'shopify-themekit watch',
                    ],
                    blocking: true,
                    parallel: false,
                },
            }),

        new MiniCssExtractPlugin({
            filename: '/assets/bundle.[name].css',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/components/*/*.liquid',
                    to: '[folder]/[name].[ext]',
                },
                {
                    from: 'src/components/templates/**/*.liquid',
                    to: 'templates/[name].[ext]',
                    flatten: true,
                },
                {
                    from: 'src/components/sections/**/*.liquid',
                    to: 'sections/[name].[ext]',
                    flatten: true,
                },
                {
                    from: 'src/components/snippets/**/*.liquid',
                    to: 'snippets/[name].[ext]',
                    flatten: true,
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
};
