/**
 * @file Tree-sitter parser for the Tauraro language
 * @author ken-morel <me@engon.cm>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "tauraro",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
