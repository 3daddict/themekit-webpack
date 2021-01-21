const {
    merge
} = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        filename: './assets/bundle.[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
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
        }, ],
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
                    transform: undefined,
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
});