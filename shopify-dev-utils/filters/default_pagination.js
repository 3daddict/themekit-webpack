module.exports.defaultPagination = function defaultPagination(paginate, ...rest) {
    const next = rest.filter((arg) => arg[0] === 'next').pop();
    const previous = rest.filter((arg) => arg[0] === 'previous').pop();

    const prevLabel =
        previous.length > 0 ? previous.pop() : paginate.previous ? paginate.previous.title : '';
    const nextLabel = next.length > 0 ? next.pop() : paginate.next ? paginate.next.title : '';

    const prevPart = paginate.previous
        ? `<span class="prev"><a href="${paginate.previous.url}" title="${prevLabel}">${prevLabel}</a></span>`
        : '';
    const nextPart = paginate.next
        ? `<span class="next"><a href="${paginate.next.url}" title="${nextLabel}">${nextLabel}</a></span>`
        : '';

    const pagesPart = paginate.parts
        .map((part) => {
            if (part.is_link) {
                return `<span class="page"><a href="${part.url}" title="${part.title}">${part.title}</a></span>`;
            }
            return `<span class="page current">${part.title}</span>`;
        })
        .join('');

    return `${prevPart}${pagesPart}${nextPart}`;
};
