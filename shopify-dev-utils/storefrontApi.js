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
{
  shop {
    name
  }
  collections(first: 50) {
    edges {
      node {
        id
        title
        handle
        description
        image(scale:1) {
          id
          altText
          originalSrc
          transformedSrc
        }
        products(first: 50) {
          edges {
            node {
              id
              title
              description
              handle
              availableForSale
              priceRange {
                maxVariantPrice {
                  amount
                  currencyCode
                }
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    id
                    altText
                    originalSrc
                  }
                }
              }
              onlineStoreUrl
            }
          }
        }
      }
    }
  }
}
`
            )
            .then(({ data }) => data)
            .catch(err => {
              console.log(err);
              res.sendStatus(500);
          });
    }
}

module.exports.StorefrontApi = StorefrontApi;
