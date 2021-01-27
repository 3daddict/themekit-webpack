"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Style = void 0;
exports.Style = {
    parse: function (tagToken, remainTokens) {
        this.tokens = [];
        const stream = this.liquid.parser.parseStream(remainTokens);
        stream
            .on('token', (token) => {
            if (token.name === 'endstyle')
                stream.stop();
            else
                this.tokens.push(token);
        })
            .on('end', () => {
            throw new Error(`tag ${tagToken.getText()} not closed`);
        });
        stream.start();
    },
    render: function () {
        const text = this.tokens.map((token) => token.getText()).join('');
        return `<style data-shopify="">${text}</style>`;
    }
};
