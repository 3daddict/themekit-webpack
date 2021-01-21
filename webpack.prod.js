const {
    merge
} = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = merge(common, {
    mode: 'production',
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