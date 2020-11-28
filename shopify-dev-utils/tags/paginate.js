"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paginate = void 0;
const liquidjs_1 = require("liquidjs");
function generatePaginateObj({ offset, perPage, total }) {
    const pages = Math.ceil(total / perPage);
    const currentPage = Math.floor((offset + perPage) / perPage);
    const paginate = {
        current_offset: offset,
        current_page: currentPage,
        items: total,
        page_size: perPage,
        parts: Array(pages)
            .fill(0)
            .map((_, index) => {
            const page = index + 1;
            if (page === currentPage) {
                return { title: page, is_link: false };
            }
            return { title: page, url: `?page=${page}`, is_link: true };
        }),
        pages,
        previous: undefined,
        next: undefined
    };
    if (currentPage === pages && pages > 1) {
        paginate.previous = {
            title: '\u0026laquo; Previous',
            url: `?page=${currentPage - 1}`,
            is_link: true
        };
    }
    else if (currentPage < pages && pages > 1) {
        paginate.next = {
            title: 'Next \u0026raquo;',
            url: `?page=${currentPage + 1}`,
            is_link: true
        };
    }
    return paginate;
}
function populateVariableObj({ data, depth }) {
    return depth.reverse().reduce((result, prop) => {
        return { [prop.getText()]: result };
    }, data);
}
exports.Paginate = {
    parse: function (tagToken, remainTokens) {
        this.templates = [];
        const stream = this.liquid.parser.parseStream(remainTokens);
        stream
            .on('start', () => {
            const toknenizer = new liquidjs_1.Tokenizer(tagToken.args);
            const list = toknenizer.readValue();
            const by = toknenizer.readWord();
            const perPage = toknenizer.readValue();
            liquidjs_1.assert(list.size() &&
                by.content === 'by' &&
                +perPage.getText() > 0 &&
                +perPage.getText() <= 50, () => `illegal tag: ${tagToken.getText()}`);
            this.args = { list, perPage: +perPage.getText() };
        })
            .on('tag:endpaginate', () => stream.stop())
            .on('template', (tpl) => {
            this.templates.push(tpl);
        })
            .on('end', () => {
            throw new Error(`tag ${tagToken.getText()} not closed`);
        });
        stream.start();
    },
    render: function* (ctx, emitter) {
        const list = yield liquidjs_1.evalToken(this.args.list, ctx) || [];
        const perPage = this.args.perPage;
        const currentPage = +ctx.get(['current_page']);
        const offset = currentPage ? (currentPage - 1) * perPage : 0;
        const variableName = this.args.list.getVariableAsText();
        const scopeList = list.slice(offset, offset + perPage);
        const data = populateVariableObj({
            data: scopeList,
            depth: this.args.list.props
        });
        const paginate = generatePaginateObj({
            offset,
            perPage,
            total: list.length
        });
        const scope = { [variableName]: data, paginate };
        ctx.push(scope);
        yield this.liquid.renderer.renderTemplates(this.templates, ctx, emitter);
        ctx.pop();
    }
};
