const yaml = require('yaml');
const fs = require('fs');
const path = require('path');
const { StorefrontApi } = require('./storefrontApi');

const configFile = path.join(__dirname, '../config.yml');
let config = { token: '', baseURL: '' };
if (fs.existsSync(configFile)) {
    const configYml = yaml.parse(fs.readFileSync(configFile, 'utf-8'));
    config.token = configYml.development.storefront_api_key;
    config.baseURL = configYml.development.store;
}

async function fetchStoreData() {
    const storefrontApi = new StorefrontApi(config);

    const { data } = await storefrontApi.getStoreData();

    console.log(JSON.stringify(data, null, 2));

    return {
        shop: {
            name: data.shop.name,
        },
        linklists: {
            'main-menu': {
                title: '',
                levels: 1,
                links: [
                    {
                        title: 'Home',
                        url: '/',
                        links: [],
                    },
                    {
                        title: 'Catalog',
                        url: '/collections/all',
                        links: [],
                    },
                ],
            },
        },
    };
}

fetchStoreData();

module.exports.fetchStoreData = fetchStoreData;
