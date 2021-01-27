module.exports.convertToGlobalDataStructure = function convertToGlobalDataStructure(gqlData) {
    // return gqlData;
    const firstProduct = gqlData.products.edges[0].node;
    const product = {
        id: firstProduct.id,
        title: firstProduct.title,
        handle: firstProduct.handle,
        description: firstProduct.description,
        content: firstProduct.description,
        published_at: firstProduct.publishedAt,
        created_at: firstProduct.createdAt,
        vendor: firstProduct.vendor,
        type: firstProduct.productType,
        tags: firstProduct.tags,
        available: firstProduct.availableForSale,
        price: firstProduct.priceRange.maxVariantPrice, // preserve the entire obj for money-* filters
        price_min: firstProduct.priceRange.minVariantPrice,
        price_max: firstProduct.priceRange.maxVariantPrice,
        price_varies:
            +firstProduct.priceRange.maxVariantPrice.amount !==
            +firstProduct.priceRange.minVariantPrice,
        compare_at_price: firstProduct.compareAtPriceRange.maxVariantPrice, // preserve the entire obj for money-* filters,
        compare_at_price_min: firstProduct.compareAtPriceRange.minVariantPrice,
        compare_at_price_max: firstProduct.compareAtPriceRange.maxVariantPrice,
        compare_at_price_varies:
            +firstProduct.compareAtPriceRange.maxVariantPrice.amount !==
            +firstProduct.compareAtPriceRange.minVariantPrice,
        images: firstProduct.images.edges.map(({ node }) => node.originalSrc),
        featured_image:
            firstProduct.images.edges.length > 0 ? firstProduct.images.edges[0].node : '',
        media: firstProduct.images.edges.map(({ node }, index) => {
            const image = {
                aspect_ratio: node.height / node.width,
                height: node.height,
                width: node.width,
                src: node.originalSrc,
            };
            return {
                id: node.id,
                alt: node.altText,
                position: index + 1,
                media_type: 'image',
                preview_image: image,
                ...image,
            };
        }),
        options: firstProduct.options.map(({ name }) => name),
        options_by_name: firstProduct.options.reduce((result, option) => {
            result[option.name] = option;
            return result;
        }, {}),
        variants: firstProduct.variants.edges.map(({ node }) => {
            return {
                id: node.id,
                title: node.title,
                public_title: null,
                options: node.selectedOptions.map((option) => option.value),
                option1: (node.selectedOptions[0] && node.selectedOptions[0].value) || null,
                option2: (node.selectedOptions[1] && node.selectedOptions[1].value) || null,
                option3: (node.selectedOptions[2] && node.selectedOptions[2].value) || null,
                sku: node.sku,
                requires_shipping: node.requiresShipping,
                taxable: true,
                featured_image: node.image,
                available: node.availableForSale,
                name: firstProduct.title,
                weight: node.weight,
                price: node.priceV2,
                compare_at_price: node.compareAtPriceV2,
                inventory_management: 'shopify',
                barcode: '',
            };
        }),
    };

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
            url: `/collections/${node.handle}`,
            products: node.products.edges.map((product) => ({
                id: product.node.id,
                title: product.node.title,
                description: product.node.description,
                handle: product.node.handle,
                available: product.node.availableForSale,
                price: product.node.priceRange.maxVariantPrice, // preserve the entire obj for money-* filters
                price_max: product.node.priceRange.maxVariantPrice,
                price_min: product.node.priceRange.minVariantPrice,
                price_varies:
                    +product.node.priceRange.maxVariantPrice.amount !==
                    +product.node.priceRange.minVariantPrice,
                url: `/products/${product.node.handle}`,
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
        product: {
            ...product,
            selected_or_first_available_variant: product.variants[0] || null,
        },
    };
};
