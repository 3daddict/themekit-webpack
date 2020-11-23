"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScript = void 0;
exports.JavaScript = {
    parse: function (tagToken, remainTokens) {
        this.tokens = [];
        const stream = this.liquid.parser.parseStream(remainTokens);
        stream
            .on('token', (token) => {
            if (token.name === 'endjavascript')
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
        return `<script>${text}</script>`;
    }
};
