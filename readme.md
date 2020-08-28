# Shopify ThemeKit with Webpack 4
Description

## 🎯 Goals
- [x] Component based folder structure
- [x] ES6 Modules
- [x] Chunk files
- [x] Optimized and Minified code
- [ ] Hot Reloading
- [ ] Lazy Loading
- [ ] Prettier Formatting
- [ ] Asset Image Optimization
- [ ] Prefetch and Preload
- [ ] Fonts & Theme Setting

## 📁 Folder Structure
This is setup for a component based file structure. All liquid, js and scss are in the same folder to keep things in one place.
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

## 🛣️ Roadmap
- [ ] Update copy-webpack-plugin to v6 [Issue #519](https://github.com/webpack-contrib/copy-webpack-plugin/issues/519)