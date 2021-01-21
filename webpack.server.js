const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const port = 9000;
const publicPath = `https://localhost:${port}/`;

 module.exports = merge(common, {
   mode: 'development',
   devtool: 'inline-source-map',
   output: {
        filename: './assets/bundle.[name].js',
        hotUpdateChunkFilename: './hot/[id].[fullhash].hot-update.js',
        hotUpdateMainFilename: './hot/[fullhash].hot-update.json',
        path: path.resolve(__dirname, 'dist'),
        publicPath,
    },
    module: {
    rules: [
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
                        'shopify-themekit watch --env=server',
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
                        'shopify-themekit deploy --env=server',
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
                    transform: function (content) {
                              content = content
                                  .toString()
                                  .replace(
                                      /{{\s*'([^']+)'\s*\|\s*asset_url\s*\|\s*(stylesheet_tag|script_tag)\s*}}/g,
                                      function (matched, fileName, type) {
                                          if (type === 'stylesheet_tag') {
                                              if (fileName !== 'tailwind.min.css') {
                                                  return '';
                                              }
                                              return matched;
                                          }

                                          return `<script src="${publicPath}assets/${fileName}"></script>`;
                                      }
                                  );

                              return content;
                          }
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
        liveReload: false,
        overlay: true,
        writeToDisk: true,
    },
 });
