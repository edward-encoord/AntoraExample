/* eslint-disable node/no-unpublished-import */
/**
 * New AsciiDoc inline macro for abbreviations.
 */

import path from 'path';
import fs from 'fs';
import {Asciidoctor} from 'asciidoctor';

const rawAbbrTxt = path.join('welcome', 'examples', 'raw-abbr.txt');

const newInlineMacroLbd: (
  this: Asciidoctor.Extensions.InlineMacroProcessor,
  parent: Asciidoctor.Document,
  target: string,
  attributes: any
) => void = function (parent, target, attributes): string {
  const full = attributes.$positional[0];
  if (full === undefined) {
    console.error(
      `The full spelling of the abbreviation "${target}" is not provided.`
    );
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
function appendAbbrToTxt(short: string, full: any) {
  const toBeAppended = `${short}:: ${full}`;
  let ifExist = false;
  fs.readFileSync(rawAbbrTxt, 'utf-8')
    .split(/\r?\n/)
    .forEach(line => {
      if (line === toBeAppended) {
        ifExist = true;
      }
    });

  // Append the abbreviation in the end, if it does not exist.
  if (!ifExist) {
    fs.appendFileSync(rawAbbrTxt, `${toBeAppended}\n`);
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
function isRegistry(
  registry: Asciidoctor.Extensions.Registry | typeof Asciidoctor.Extensions
): registry is Asciidoctor.Extensions.Registry {
  return (registry as Asciidoctor.Extensions.Registry).block !== undefined;
}

module.exports.register = function register(
  registry: Asciidoctor.Extensions.Registry | typeof Asciidoctor.Extensions
) {
  if (isRegistry(registry)) {
    registry.inlineMacro('abbr', function () {
      this.process(newInlineMacroLbd);
    });
  } else {
    registry.register(function () {
      this.inlineMacro('abbr', function () {
        this.process(newInlineMacroLbd);
      });
    });
  }
  return registry;
};
