const Axios = require('axios');

class StorefrontApi {
    constructor({ baseURL, token }) {
        console.log(`https://${baseURL}/api/2020-10/graphql`);
        this.axios = Axios.create({
            baseURL: `https://${baseURL}/api/2020-10/graphql`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/graphql',
                'X-Shopify-Storefront-Access-Token': token,
            },
        });
    }

    async getStoreData() {
        return this.axios
            .post(
                '',
                `
query {
  shop {
    name
  }
}`
            )
            .then(({ data }) => data);
    }
}

module.exports.StorefrontApi = StorefrontApi;
