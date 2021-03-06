const glob = require('glob');
const { argv } = require('yargs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isDev = argv.mode === 'development';
const stats = isDev ? 'errors-warnings' : { children: false };

module.exports = {
    stats: stats,
    entry: glob.sync('./src/components/**/*.js').reduce((acc, path) => {
        const entry = path.replace(/^.*[\\\/]/, '').replace('.js', '');
        acc[entry] = path;
        return acc;
    }, {}),
    module: {
        rules: [
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
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new ESLintPlugin({
            fix: true,
        }),
        new MiniCssExtractPlugin({
            filename: '/assets/bundle.[name].css',
        }),
        new CopyPlugin({
            patterns: [
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
    optimization: {
        runtimeChunk: { name: 'runtime' },
    },
};
