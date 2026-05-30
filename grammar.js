/**
 * @file Tree-sitter parser for the Tauraro language
 * @author ken-morel <me@engon.cm>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "tauraro",

  extras: $ => [
    $.line_comment,
    /[\s\f\uFEFF\u2060\u200B]|\\\r?\n/
  ],

  conflicts: $ => [
    [$.type_generic, $._expression],
    [$.method_call, $._expression],
    [$.function_call, $._expression],
    [$.class_definition, $.keywords_declaration],
    [$.class_definition, $.keywords_hausa],
    [$.function_definition, $.keywords_declaration],
    [$.function_definition, $.keywords_hausa],
    [$.interface_definition, $.keywords_declaration],
    [$.enum_definition, $.keywords_declaration],
    [$.struct_definition, $.keywords_declaration],
    [$.struct_definition, $.keywords_hausa],
    [$.extend_definition, $.keywords_declaration],
    [$._expression, $.keywords_modifier],
    [$.keywords_exception, $.builtin_functions],
  ],

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat($._item),

    _item: $ => choice(
      $.decorator,
      $.class_definition,
      $.function_definition,
      $.interface_definition,
      $.enum_definition,
      $.struct_definition,
      $.extend_definition,
      $.import_statement,
      $._expression,
      $._statement_keywords,
      $.punctuation,
      $.colon
    ),

    decorator: $ => seq(
      '@',
      alias(/[A-Za-z_][\w.]*/, $.identifier)
    ),

    class_definition: $ => seq(
      choice('class', 'aji'),
      field('name', $.identifier)
    ),

    function_definition: $ => seq(
      choice('def', 'aiki'),
      field('name', $.identifier)
    ),

    interface_definition: $ => seq(
      'interface',
      field('name', $.identifier)
    ),

    enum_definition: $ => seq(
      'enum',
      field('name', $.identifier)
    ),

    struct_definition: $ => seq(
      choice('struct', 'tsari'),
      field('name', $.identifier)
    ),

    extend_definition: $ => seq(
      'extend',
      field('name', $.identifier)
    ),

    import_statement: $ => choice(
      seq('from', field('module', $.identifier_dotted), 'import'),
      seq('import', field('module', $.identifier_dotted))
    ),

    _statement_keywords: $ => choice(
      $.keywords_hausa,
      $.keywords_exception,
      $.keywords_async,
      $.keywords_control,
      $.keywords_declaration,
      $.keywords_modifier,
      $.keywords_operator_word
    ),

    keywords_hausa: $ => choice(
      'aiki', 'aji', 'tsari', 'idan', 'koidan', 'sai', 'ga', 'yayinda',
      'dawo', 'tsaya', 'ci_gaba', 'wuce', 'duba', 'hali', 'gwada', 'kama',
      'karshe', 'jefa', 'marasa_jira', 'jira', 'bayar', 'dan_aiki'
    ),

    keywords_exception: $ => choice(
      'try', 'except', 'finally', 'raise', 'with', 'assert'
    ),

    keywords_async: $ => choice(
      'async', 'await', 'spawn', 'yield'
    ),

    keywords_control: $ => choice(
      'if', 'elif', 'else', 'for', 'while', 'return', 'break', 'continue',
      'pass', 'match', 'case', 'in', 'is', 'as', 'del', 'global', 'nonlocal',
      'unsafe', 'extern'
    ),

    keywords_declaration: $ => choice(
      'def', 'class', 'struct', 'interface', 'enum', 'extend', 'lambda'
    ),

    keywords_modifier: $ => choice(
      'pub', 'mut', 'static', 'const', 'abstract', 'virtual', 'override', 'let'
    ),

    keywords_operator_word: $ => choice(
      'and', 'or', 'not', 'da', 'ko', 'ba'
    ),

    builtin_exceptions: $ => choice(
      'Exception', 'ValueError', 'TypeError', 'RuntimeError', 'IOError',
      'OSError', 'NameError', 'KeyError', 'IndexError', 'AttributeError',
      'ImportError', 'MemoryError', 'RecursionError', 'NotImplementedError',
      'StopIteration', 'SystemExit', 'KeyboardInterrupt', 'ZeroDivisionError',
      'OverflowError', 'FileNotFoundError', 'PermissionError', 'TimeoutError',
      'ArithmeticError', 'LookupError'
    ),

    builtin_functions: $ => choice(
      'print', 'buga', 'len', 'range', 'input', 'abs', 'min', 'max', 'sum',
      'round', 'pow', 'enumerate', 'zip', 'map', 'filter', 'sorted',
      'reversed', 'any', 'all', 'chr', 'ord', 'hex', 'bin', 'oct',
      'isinstance', 'type', 'callable', 'hasattr', 'getattr', 'setattr',
      'id', 'hash', 'repr', 'format', 'iter', 'next', 'open', 'super',
      'vars', 'dir', 'eval', 'exec', 'assert'
    ),

    builtin_types: $ => choice(
      'str', 'int', 'i8', 'i16', 'i32', 'i64', 'i128', 'u8', 'u16', 'u32',
      'u64', 'u128', 'f32', 'f64', 'bool', 'char', 'void', 'List', 'Dict',
      'Tuple', 'Set', 'Option', 'Result', 'Box', 'Vec', 'String', 'Bytes',
      'Any', 'Never', 'Self', 'Map', 'Pointer'
    ),

    constants: $ => choice(
      'true', 'false', 'none', 'null', 'gaskiya', 'karya', 'babu'
    ),

    self_keyword: $ => 'self',

    _expression: $ => choice(
      $.builtin_exceptions,
      $.builtin_functions,
      $.builtin_types,
      $.constants,
      $.self_keyword,
      $.string,
      $.number,
      $.type_generic,
      $.method_call,
      $.function_call,
      $.operators,
      $.identifier
    ),

    string: $ => choice(
      $.docstring,
      $.f_string,
      $.raw_string,
      $.byte_string,
      $.normal_string
    ),

    docstring: $ => choice(
      seq('"""', repeat(choice($.escape_sequence, /[^"\\]+/ , /"/)), '"""'),
      seq("'''", repeat(choice($.escape_sequence, /[^'\\]+/ , /'/)), "'''")
    ),

    f_string: $ => choice(
      seq('f"', repeat(choice($.fstring_interpolation, $.escape_sequence, /[^"\\{]+/)), '"'),
      seq("f'", repeat(choice($.fstring_interpolation, $.escape_sequence, /[^'\\{]+/)), "'")
    ),

    fstring_interpolation: $ => seq(
      '{',
      $._expression,
      '}'
    ),

    raw_string: $ => choice(
      /r"[^"]*"/,
      /r'[^']*'/
    ),

    byte_string: $ => choice(
      seq('b"', repeat(choice($.escape_sequence, /[^"\\]+/)), '"'),
      seq("b'", repeat(choice($.escape_sequence, /[^'\\]+/)), "'")
    ),

    normal_string: $ => choice(
      seq('"', repeat(choice($.escape_sequence, /[^"\\]+/)), '"'),
      seq("'", repeat(choice($.escape_sequence, /[^'\\]+/)), "'")
    ),

    escape_sequence: $ => token(
      /\\(?:[\\"’nrtbfav0]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8}|N\{[^}]+\})/
    ),

    number: $ => token(choice(
      /0[xX][0-9a-fA-F][0-9a-fA-F_]*/,
      /0[bB][01][01_]*/,
      /0[oO][0-7][0-7_]*/,
      /[0-9][0-9_]*\.[0-9][0-9_]*(?:[eE][+-]?[0-9][0-9_]*)?(?:f32|f64)?/,
      /[0-9][0-9_]*[eE][+-]?[0-9][0-9_]*(?:f32|f64)?/,
      /[0-9][0-9_]*(?:i8|i16|i32|i64|i128|u8|u16|u32|u64|u128)?/
    )),

    type_generic: $ => seq(
      field('type', $.identifier),
      '['
    ),

    method_call: $ => seq(
      '.',
      field('method', $.identifier),
      '('
    ),

    function_call: $ => seq(
      field('function', $.identifier),
      '('
    ),

    operators: $ => choice(
      '->', '=>', '??', '!!', '?', '...', '..',
      '==', '!=', '<=', '>=', '<', '>',
      '+=', '-=', '**=', '*=', '//=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=',
      ':=', '<-', '~>', '=',
      '**', '//', '+', '-', '*', '/', '%',
      '<<', '>>', '&', '|', '^', '~'
    ),

    punctuation: $ => choice(
      '(', ')', '[', ']', '{', '}', ',', ';'
    ),

    colon: $ => ':',

    identifier: $ => /[A-Za-z_][\w]*/,

    identifier_dotted: $ => /[A-Za-z_][\w.]*/,

    line_comment: $ => /#.*/
  }
});
