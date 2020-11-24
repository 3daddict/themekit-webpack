module.exports.fetchStoreData = function fetchStoreData() {

  return {
    'shop': {
      'name': 'themekit-webpack-test'
    },
    'linklists': {
      'main-menu': {
        'title': '',
        'levels': 1,
        'links': [
          {
            'title': 'Home',
            'url': '/',
            'links': []
          },
          {
            'title': 'Catalog',
            'url': '/collections/all',
            'links': []
          }
        ]
      }
    }
  };
};
