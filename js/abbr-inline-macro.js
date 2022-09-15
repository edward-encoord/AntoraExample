"use strict";
/* eslint-disable node/no-unpublished-import */
/**
 * New AsciiDoc inline macro for abbreviations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const newInlineMacroLbd = function (parent, target, attributes) {
    const full = attributes.$positional[0];
    if (full === undefined) {
        console.error(`The full spelling of the abbreviation "${target}" is not provided.`);
    }
    const text = `<abbr title="${full}">${target}</abbr>`;
    return this.createInline(parent, 'quoted', text, {}).convert();
};
/**
 * Set a type guard for received registry.
 *
 * Based on
 * https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates.
 *
 * @param registry received registry, which can be a registry object or the
 *  namespace.
 * @returns a registry object or the namespace.
 */
function isRegistry(registry) {
    return registry.block !== undefined;
}
module.exports.register = function register(registry) {
    if (isRegistry(registry)) {
        registry.inlineMacro('abbr', function () {
            this.process(newInlineMacroLbd);
        });
    }
    else {
        registry.register(function () {
            this.inlineMacro('abbr', function () {
                this.process(newInlineMacroLbd);
            });
        });
    }
    return registry;
};
//# sourceMappingURL=abbr-inline-macro.js.map