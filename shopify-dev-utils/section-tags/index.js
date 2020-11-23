"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.liquidSectionTags = void 0;
const javascript_1 = require("./javascript");
const schema_1 = require("./schema");
const section_1 = require("./section");
const stylesheet_1 = require("./stylesheet");
function liquidSectionTags() {
    return function () {
        this.registerTag('section', section_1.Section);
        this.registerTag('schema', schema_1.Schema);
        this.registerTag('stylesheet', stylesheet_1.StyleSheet);
        this.registerTag('javascript', javascript_1.JavaScript);
    };
}
exports.liquidSectionTags = liquidSectionTags;
