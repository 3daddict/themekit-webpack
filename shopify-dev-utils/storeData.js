const yaml = require('yaml');
const fs = require('fs');
const path = require('path');
const { convertToGlobalDataStructure } = require('./convertToGlobalDataStructure');
const { StorefrontApi } = require('./storefrontApi');

const configFile = path.join(__dirname, '../config.yml');
let config = { token: '', baseURL: '' };
if (fs.existsSync(configFile)) {
    const configYml = yaml.parse(fs.readFileSync(configFile, 'utf-8'));
    config.token = configYml.development.storefront_api_key;
    config.baseURL = configYml.development.store;

    if (!config.token) {
        console.warn(`'storefront_api_key' was not found in 'config.yml'`);
    }
}

function getGlobalSettings() {
    const rawSettings = require('../src/config/settings_schema.json');
    const overrides = { environment: 'development' };

    return rawSettings
        .filter((section) => !!section.settings)
        .reduce((result, section) => {
            section.settings
                .filter((setting) => !!setting.id && typeof setting.default !== 'undefined')
                .forEach((setting) => {
                    result[setting.id] = overrides[setting.id] || setting.default;
                });
            return result;
        }, {});
}

async function getStoreGlobalData() {
    const storefrontApi = new StorefrontApi(config);

    const data = await storefrontApi
        .getStoreData()
        .then(({ data }) => convertToGlobalDataStructure(data));

    return {
        shop: {
            name: data.shop.name,
        },
        settings: getGlobalSettings(),
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
        collection: data.collections[0],
    };
}

module.exports.getStoreGlobalData = getStoreGlobalData;
