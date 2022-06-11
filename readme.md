![GitHub](https://img.shields.io/github/license/3daddict/themekit-webpack) ![GitHub issues](https://img.shields.io/github/issues/3daddict/themekit-webpack) ![GitHub watchers](https://img.shields.io/github/watchers/3daddict/themekit-webpack) ![GitHub Repo stars](https://img.shields.io/github/stars/3daddict/themekit-webpack) ![GitHub forks](https://img.shields.io/github/forks/3daddict/themekit-webpack) [![Github all releases](https://img.shields.io/github/downloads/3daddict/themekit-webpack/total.svg)](https://GitHub.com/3daddict/themekit-webpack/releases/)

# (Legacy) Shopify ThemeKit with Webpack 5
This is a starter Theme using Webpack, ThemeKit and TailwindCSS for developing Shopify themes with modern build tools. The goal is to create a tool with a component-based folder structure and is easy to use. With the new Shopify CLI a Webpack Dev Server is no loger needed. Please refer to this new project for Shopify 2.0 theme: [webpack-shopify-cli](https://github.com/3daddict/webpack-shopify-cli)

## Contributing
To contribute to this repo please see
- [CONTRIBUTING.md](https://github.com/3daddict/themekit-webpack/blob/master/CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](https://github.com/3daddict/themekit-webpack/blob/master/CODE_OF_CONDUCT.md)

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
**Note:** The scss or css file can alternatively be imported into the js file which will get compiled with webpack.
## Node Version Manager
This theme setup is built with Yarn, Webpack and ThemeKit which are dependant on NodeJS versions.
You can use node `v14` to install dependencies and run build commands.
- Install [nvm](http://npm.github.io/installation-setup-docs/installing/using-a-node-version-manager.html)
- Run `nvm install v14` in terminal
- Install dependencies `yarn install`

## Clean-CSS CLI
This project uses [clean-css-cli](https://www.npmjs.com/package/clean-css-cli) to minify TailwindCSS during build.

Install Clean-CSS CLI  
`yarn add clean-css-cli -g`  
**Note:** Global install via -g option is recommended unless you want to execute the binary via a relative path, i.e. ./node_modules/.bin/cleancss

## TailwindCSS
This project uses [TailwindCSS](https://tailwindcss.com/) `v2` a utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup. Checkout the amazing [documentation](https://tailwindcss.com/docs) and start adding classes to your elements.

## Getting Started
- Install dependencies `yarn install` or `npm i`
- Rename the `config.yml.example` to `config.yml` and add the Shopify Theme credentials
- Run a build test `yarn build` if no errors then you are good to go  
  
**Note:** the first time you run `yarn start` or `yarn deploy` to a new theme you must comment out `ignore_files`.
```
# - config/settings_data.json
# - "*.js"
# - "*.hot-update.json"
```

## Webpack Dev Server
- `yarn start` will run build commands and start the webpack development server.
- `yarn build` will run build commands and create a dist folder of the compiled files.
- `yarn deploy` will upload the dist folder contents to your theme configured in the yml

## Self-Signed Certificate
In the event that you find the HMR assets are not loading and the requests to localhost:9000 are 404 you will need to approve or pass a valid certificate.
To solve this issue you can open a new browser window and approve the SSL Certificate or pass a valid certificate as mentioned here [devServer.https](https://webpack.js.org/configuration/dev-server/#devserverhttps).

**Note:** a quick fix with Chrome `chrome://flags/#allow-insecure-localhost` change to enable

## HMR (Hot Module Reloading)
When in development mode `yarn start` hot module reloading is enabled. It watches for changes to `JavaScript`, `CSS` and `Liquid` files. When JS or CSS is changes the browser will change without the need to refresh. When changes are made to liquid files a manual browser reload may be required.

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

## Variable Scope & Components
This is not unique to this project but it's worth mentioning and creating a component example. See the `src/components/snippets/dynamic-modal/dynamic-modal.liquid` component. This is a simple modal that uses variable scope for data, styles and functions.
Use this `dynamic-modal.liquid` component by creating a trigger element or function like a button with an id.
```html
<button id="testButton">Trigger Modal</button>
```
Next we include the modal in a section with declared variables. These will be scoped to the snippet and we now have a dynamic reusable modal component we can use throughout our theme.
```html
{%- render 'dynamic-modal', 
  id: "testModal", 
  openModalBtn: "modalBtn",
  title: "Modal Title",
  body: "Modal Body",
  buttonOne: "Alert",
  buttonOneFunction: "alert('Q: Do you struggle with impostor syndrome? Me: no I’m great at it')"
  buttonTwo: "Close",
  buttonTwoStyle: "text-white bg-red-500 hover:bg-red-700"
  buttonTwoFunction: "modal.style.display = 'none';"
-%}
```
I came across this idea using `include` from [David Warrington's](https://github.com/davidwarrington) article [Shopify Variable Scopes](https://ellodave.dev/blog/2019/5/24/shopify-variable-scopes/) and re-factored to use `render` tags. If you find some good use cases for these please post them in the [discussion ideas category](https://github.com/3daddict/themekit-webpack/discussions/categories/ideas)
