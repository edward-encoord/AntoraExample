"use strict";
/* eslint-disable node/no-unpublished-import */
/**
 * New AsciiDoc inline macro for abbreviations.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const rawAbbrTxt = path_1.default.join('welcome', 'modules', 'ROOT', 'examples', 'raw-abbr.txt');
const newInlineMacroLbd = function (parent, target, attributes) {
    const full = attributes.$positional[0];
    if (full === undefined) {
        console.error(`The full spelling of the abbreviation "${target}" is not provided.`);
    }
    const text = `<abbr title="${full}">${target}</abbr>`;
    // Check if the abbreviation exists already.
    appendAbbrToTxt(target, full);
    return this.createInline(parent, 'quoted', text, {}).convert();
};
/**
 * Append an abbreviation and its full name to a txt file.
 * @param short the abbreviation.
 * @param full the full name of the abbreivation.
 */
function appendAbbrToTxt(short, full) {
    const toBeAppended = `${short}:: ${full}`;
    let ifExist = false;
    fs_1.default.readFileSync(rawAbbrTxt, 'utf-8')
        .split(/\r?\n/)
        .forEach(line => {
        if (line === toBeAppended) {
            ifExist = true;
        }
    });
    // Append the abbreviation in the end, if it does not exist.
    if (!ifExist) {
        fs_1.default.appendFileSync(rawAbbrTxt, `${toBeAppended}\n`);
        console.info(`Found abbreviation, "${short}" (short for "${full}").`);
    }
}
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