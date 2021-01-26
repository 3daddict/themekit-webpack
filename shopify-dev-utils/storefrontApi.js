const Axios = require('axios');

class StorefrontApi {
    constructor({ baseURL, token }) {
        this.axios = Axios.create({
            baseURL: `https://${baseURL}/api/2021-01/graphql.json`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/graphql',
                'X-Shopify-Storefront-Access-Token': token,
            },
        });
    }
    // GQL query can be tested https://shopify.dev/graphiql/storefront-graphiql
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
  products(first: 10) {
    edges {
      node {
        id
        handle
        createdAt
        publishedAt
        vendor
        tags
        description
        descriptionHtml
        title
        tags
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
        compareAtPriceRange {
          maxVariantPrice {
            amount
            currencyCode
          }
          minVariantPrice {
            amount
            currencyCode
          }
        }
        options {
          id
          name
          values
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              sku
              priceV2 {
                amount
                currencyCode
              }
              compareAtPriceV2 {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              availableForSale
              quantityAvailable
              requiresShipping
              weight
              image {
                id
                height
                altText
                width
                originalSrc
              }
            }
          }
        }
        productType
        images(first: 10) {
          edges {
            node {
              id
              altText
              height
              width
              originalSrc
            
            }
          }
        }
        availableForSale
      }
    }
  }
}
`
            )
            .then(({ data }) => data);
    }
}

module.exports.StorefrontApi = StorefrontApi;
