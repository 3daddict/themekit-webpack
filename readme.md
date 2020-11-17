![GitHub](https://img.shields.io/github/license/3daddict/themekit-webpack) ![GitHub issues](https://img.shields.io/github/issues/3daddict/themekit-webpack) ![GitHub watchers](https://img.shields.io/github/watchers/3daddict/themekit-webpack) ![GitHub Repo stars](https://img.shields.io/github/stars/3daddict/themekit-webpack) ![GitHub forks](https://img.shields.io/github/forks/3daddict/themekit-webpack)

# Shopify ThemeKit with Webpack 4
This is a starter Theme using Webpack, ThemeKit and TailwindCSS for developing Shopify themes with modern build tools. The goal is to create a tool with a component-based folder structure and is easy to use.

## 🎯 Goals
- [x] Component based folder structure
- [x] ES6 Modules
- [x] Chunk files
- [x] Optimized and Minified code
- [x] Hot Module Reloading - Thanks [@felixmosh](https://github.com/felixmosh)!
- [ ] Lazy Loading
- [x] Prettier Formatting
- [ ] Linter
- [ ] Prefetch and Preload
- [ ] Fonts & Theme Setting
- [x] [TailwindCSS](https://tailwindcss.com/)

## 📁 Folder Structure
This is set up for a component-based file structure. All liquid, js and scss are in the same folder to keep things in one place.
Example of folder structure:
* components
    * sections
        * header
            - header.js
            - header.liquid
            - header.scss

**Note:** always import component scss files into the component javascript file. For example `import './header.scss';` is inside `header.js`. This ensures the scss will get compiled to css with Webpack.
There are some rules to follow with this folder structure. For each component liquid file use the following template.
```html
<style></style>
<html></html>
<script></script>
```
It's important to reference styles and scripts from the compiles assets folder. Webpack will compile all js and css files under the filename.
For example a starting template for a `header.liquid` component would look like this.
```html
<!-- Reference to compiled style in assets folder -->
{{ 'bundle.header.css' | asset_url | stylesheet_tag }}

<div class="header_container">
    <!-- HTML HERE -->
</div>

<!-- Reference to compiled js in assets folder -->
{{ 'bundle.header.js' | asset_url | script_tag }}
```
## Node Version Manager
This theme setup is built with Yarn, Webpack and ThemeKit which are dependant on NodeJS versions.
You can use node `v14` to install dependencies and run build commands.
- Install [nvm](http://npm.github.io/installation-setup-docs/installing/using-a-node-version-manager.html)
- Run `nvm install v14` in terminal
- Install dependencies `yarn install`

## Getting Started
- Install dependencies `yarn install` or `npm i`
- Rename the `config.yml.example` to `config.yml` and add the Shopify Theme credentials
- Run a build test `yarn build` if no errors then you are good to go

## Whitespace control
In [Liquid](https://shopify.github.io/liquid/basics/whitespace/), you can include a hyphen in your tag syntax `{{-`, `-}}`, `{%-`, and `-%}` to strip whitespace from the left or right side of a rendered tag.
By including hyphens in your `assign` tag, you can strip the generated whitespace from the rendered template.
If you don’t want any of your tags to print whitespace, as a general rule you can add hyphens to both sides of all your tags (`{%-` and `-%}`):
```html
{%- assign username = "Borat Margaret Sagdiyev" -%}
{%- if username and username.size > 10 -%}
  Wow, {{ username }}, I like!
{%- else -%}
  Hello there!
{%- endif -%}
```

## HMR (Hot Module Reloading)
When in development mode `yarn start` hot module reloading is enabled. It watched for changes to `JavaScript`, `CSS` and `Liquid` files. When JS or CSS is changes the browser will change without the need to refresh. When changes are made to liquid files a manual browser reload is required.

## Self-Signed Certificate
In the event that you find the HMR assets are not loading and the requests to localhost:9000 are 404 you will need to approve or pass a valid certificate.<br>![image](https://user-images.githubusercontent.com/29803478/99157400-46787900-267d-11eb-96be-4796dbd01ef9.png)<br>To solve this issue you can open a new browser window and approve the SSL Certificate or pass a valid certificate as mentioned here [devServer.https](https://webpack.js.org/configuration/dev-server/#devserverhttps).

## 🛣️ Roadmap
- [ ] Finalization and First Release
- [x] Update copy-webpack-plugin to v6 [Issue #519](https://github.com/webpack-contrib/copy-webpack-plugin/issues/519) Thanks [@felixmosh](https://github.com/felixmosh)!
- [ ] Webpack 5? 🤔
