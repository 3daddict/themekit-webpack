"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
function generateSettingsObj(settings) {
    if (!Array.isArray(settings)) {
        return settings;
    }
    return settings
        .filter((entry) => !!entry.id)
        .reduce((sectionSettings, entry) => {
        sectionSettings[entry.id] = entry.default;
        return sectionSettings;
    }, {});
}
exports.Schema = {
    parse: function (tagToken, remainTokens) {
        this.tokens = [];
        const stream = this.liquid.parser.parseStream(remainTokens);
        stream
            .on('token', (token) => {
            if (token.name === 'endschema') {
                stream.stop();
            }
            else
                this.tokens.push(token);
        })
            .on('end', () => {
            throw new Error(`tag ${tagToken.getText()} not closed`);
        });
        stream.start();
    },
    render: function (ctx) {
        const json = this.tokens.map((token) => token.getText()).join('');
        const schema = JSON.parse(json);
        const scope = ctx.scopes[ctx.scopes.length - 1];
        scope.section = {
            settings: generateSettingsObj(schema.settings),
            blocks: (schema.blocks || []).map((block) => ({
                ...block,
                settings: generateSettingsObj(block.settings)
            }))
        };
        return '';
    }
};
