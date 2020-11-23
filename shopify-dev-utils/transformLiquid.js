const path = require('path');

module.exports.transformLiquid = function transformLiquid(publicPath) {
  return (content, absolutePath) => {
    const relativePath = path.join(__dirname, '../src');
    const diff = path.relative(relativePath, absolutePath);

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

    if(diff.includes('/layout/theme.liquid')) {
      // inject HMR entry bundle
      content = content.replace('</head>',`<script src="${publicPath}assets/bundle.liquidDev.js"></script></head>`)
    }

    return `<!-- hmr-start: ./${diff} -->${content}<!-- hmr-end: ./${diff} -->`;
  };
}
