/**
 * @file Tree-sitter grammar for the tauraro programming language
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
