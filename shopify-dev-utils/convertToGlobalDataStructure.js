module.exports.convertToGlobalDataStructure = function convertToGlobalDataStructure(gqlData) {
    // return gqlData;
    return {
        shop: {
            name: gqlData.shop.name,
        },
        collections: gqlData.collections.edges.map(({ node }) => ({
            title: node.title,
            id: node.id,
            handle: node.handle,
            image: node.image,
            description: node.description,
            url: 'unknown-url', // TODO: find a way to get the collection url
            products: node.products.edges.map((product) => ({
                id: product.node.id,
                title: product.node.title,
                description: product.node.description,
                handle: product.node.handle,
                available: product.node.availableForSale,
                price: product.node.priceRange,
                url: 'unknown-url', // TODO: find a way to get the product url
                featured_image:
                    product.node.images.edges.length > 0
                        ? {
                              id: product.node.images.edges[0].node.id,
                              alt: product.node.images.edges[0].node.altText,
                              src: product.node.images.edges[0].node.originalSrc,
                          }
                        : null,
            })),
        })),
    };
};
