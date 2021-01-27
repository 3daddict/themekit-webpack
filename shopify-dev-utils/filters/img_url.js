const path = require('path');

module.exports.imgUrl = function imgUrl(image, size) {
    if (!image || !image.originalSrc) {
        return '';
    }

    const [imgPath, query] = image.originalSrc.split('?');
    const imageParts = path.parse(imgPath);

    return `${imageParts.dir}/${imageParts.name}${size !== 'master' ? '_' + size : ''}${
        imageParts.ext
    }?${query}`;
};
