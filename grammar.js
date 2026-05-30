/**
 * @file Tree-sitter parser for the Tauraro language
 * @author ken-morel <me@engon.cm>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  ASSIGNMENT: 1,
  OR: 2,
  AND: 3,
  NOT: 4,
  COMPARE: 5,
  BITWISE_OR: 6,
  BITWISE_XOR: 7,
  BITWISE_AND: 8,
  SHIFT: 9,
  ADD: 10,
  MULTIPLY: 11,
  POWER: 12,
  UNARY: 13,
  CALL: 14,
  MEMBER: 15,
};

export default grammar({
  name: "tauraro",

  extras: $ => [
    $.line_comment,
    /[\s\f\uFEFF\u2060\u200B]|\\\r?\n/
  ],

  conflicts: $ => [
    [$._expression, $.primary_expression],
    [$._statement, $._expression],
    [$.variable_declaration, $.primary_expression],
    [$.return_statement],
    [$.yield_statement],
    [$.raise_statement],
    [$.if_statement],
    [$.for_statement],
    [$.while_statement],
    [$.match_statement],
    [$.try_statement],
    [$.with_statement],
    [$.class_definition],
    [$.function_definition],
    [$.struct_definition],
    [$.interface_definition],
    [$.enum_definition],
    [$.extend_definition],
    [$.block],
    [$.parameter],
    [$.modifier],
  ],

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.class_definition,
      $.function_definition,
      $.interface_definition,
      $.enum_definition,
      $.struct_definition,
      $.extend_definition,
      $.import_statement,
      $.variable_declaration,
      $.if_statement,
      $.for_statement,
      $.while_statement,
      $.match_statement,
      $.try_statement,
      $.with_statement,
      $.return_statement,
      $.break_statement,
      $.continue_statement,
      $.pass_statement,
      $.raise_statement,
      $.yield_statement,
      $.expression_statement
    ),

    // Definitions
    class_definition: $ => seq(
      repeat($.modifier),
      choice('class', 'aji'),
      field('name', $.identifier),
      field('body', $.block)
    ),

    function_definition: $ => seq(
      repeat($.modifier),
      optional(choice('async', 'marasa_jira')),
      choice('def', 'aiki'),
      field('name', $.identifier),
      field('parameters', $.parameters),
      optional(seq('->', field('return_type', $._type))),
      field('body', $.block)
    ),

    interface_definition: $ => seq(
      'interface',
      field('name', $.identifier),
      field('body', $.block)
    ),

    enum_definition: $ => seq(
      'enum',
      field('name', $.identifier),
      field('body', $.block)
    ),

    struct_definition: $ => seq(
      repeat($.modifier),
      choice('struct', 'tsari'),
      field('name', $.identifier),
      field('body', $.block)
    ),

    extend_definition: $ => seq(
      'extend',
      field('name', $.identifier),
      field('body', $.block)
    ),

    // Imports
    import_statement: $ => choice(
      seq('from', field('module', $.identifier_dotted), 'import', choice($.identifier, $.import_list)),
      seq('import', field('module', $.identifier_dotted))
    ),

    import_list: $ => seq('(', sep1($.identifier, ','), ')'),

    // Control Flow
    if_statement: $ => seq(
      choice('if', 'idan'),
      field('condition', $._expression),
      field('consequence', $.block),
      repeat($.elif_clause),
      optional($.else_clause)
    ),

    elif_clause: $ => seq(
      choice('elif', 'koidan'),
      field('condition', $._expression),
      field('consequence', $.block)
    ),

    else_clause: $ => seq(
      choice('else', 'sai'),
      field('body', $.block)
    ),

    for_statement: $ => seq(
      choice('for', 'ga'),
      field('left', $.identifier),
      'in',
      field('right', $._expression),
      field('body', $.block)
    ),

    while_statement: $ => seq(
      choice('while', 'yayinda'),
      field('condition', $._expression),
      field('body', $.block)
    ),

    match_statement: $ => seq(
      choice('match', 'duba'),
      field('value', $._expression),
      field('body', $.block)
    ),

    case_clause: $ => seq(
      choice('case', 'hali'),
      field('pattern', $._expression),
      field('body', $.block)
    ),

    try_statement: $ => seq(
      choice('try', 'gwada'),
      field('body', $.block),
      repeat($.except_clause),
      optional($.finally_clause)
    ),

    except_clause: $ => seq(
      choice('except', 'kama'),
      optional($._expression),
      field('body', $.block)
    ),

    finally_clause: $ => seq(
      choice('finally', 'karshe'),
      field('body', $.block)
    ),

    with_statement: $ => seq(
      'with',
      $._expression,
      field('body', $.block)
    ),

    // Other statements
    variable_declaration: $ => seq(
      repeat($.modifier),
      field('name', $.identifier),
      optional(seq(':', field('type', $._type))),
      optional(seq('=', field('value', $._expression)))
    ),

    return_statement: $ => seq(
      choice('return', 'dawo'),
      optional($._expression)
    ),

    break_statement: $ => choice('break', 'tsaya'),
    continue_statement: $ => choice('continue', 'ci_gaba'),
    pass_statement: $ => choice('pass', 'wuce'),

    raise_statement: $ => seq(
      choice('raise', 'jefa'),
      $._expression
    ),

    yield_statement: $ => seq(
      choice('yield', 'bayar'),
      optional($._expression)
    ),

    expression_statement: $ => $._expression,

    // Block
    block: $ => seq(
      ':',
      choice(
        $._statement,
        seq(
          repeat1($._statement)
        )
      )
    ),

    // Expressions
    _expression: $ => choice(
      $.primary_expression,
      $.binary_expression,
      $.unary_expression,
      $.assignment_expression,
      $.lambda_expression,
      $.call_expression,
      $.member_expression,
      $.subscript_expression,
      $.await_expression,
      $.spawn_expression
    ),

    primary_expression: $ => choice(
      $.identifier,
      $.number,
      $.string,
      $.boolean,
      $.none,
      $.self,
      $.builtin_functions,
      $.builtin_types,
      $.builtin_exceptions,
      seq('(', $._expression, ')')
    ),

    assignment_expression: $ => prec.right(PREC.ASSIGNMENT, seq(
      field('left', $._expression),
      field('operator', choice('=', ':=', '+=', '-=', '*=', '/=', '//=', '%=', '&=', '|=', '^=', '<<=', '>>=', '**=')),
      field('right', $._expression)
    )),

    binary_expression: $ => {
      const table = [
        [PREC.OR, choice('or', 'ko')],
        [PREC.AND, choice('and', 'da')],
        [PREC.BITWISE_OR, '|'],
        [PREC.BITWISE_XOR, '^'],
        [PREC.BITWISE_AND, '&'],
        [PREC.COMPARE, choice('==', '!=', '<', '<=', '>', '>=', 'in', 'is')],
        [PREC.SHIFT, choice('<<', '>>')],
        [PREC.ADD, choice('+', '-')],
        [PREC.MULTIPLY, choice('*', '/', '//', '%')],
        [PREC.POWER, '**'],
      ];

      return choice(...table.map(([p, op]) => prec.left(p, seq(
        field('left', $._expression),
        field('operator', op),
        field('right', $._expression)
      ))));
    },

    unary_expression: $ => prec(PREC.UNARY, seq(
      field('operator', choice('not', 'ba', '-', '+', '~')),
      field('argument', $._expression)
    )),

    await_expression: $ => prec(PREC.UNARY, seq(
      choice('await', 'jira'),
      $._expression
    )),

    spawn_expression: $ => prec(PREC.UNARY, seq(
      choice('spawn', 'dan_aiki'),
      $._expression
    )),

    lambda_expression: $ => seq(
      'lambda',
      field('parameters', $.parameters),
      ':',
      field('body', $._expression)
    ),

    call_expression: $ => prec(PREC.CALL, seq(
      field('function', $._expression),
      field('arguments', $.arguments)
    )),

    member_expression: $ => prec(PREC.MEMBER, seq(
      field('object', $._expression),
      '.',
      field('member', $.identifier)
    )),

    subscript_expression: $ => prec(PREC.MEMBER, seq(
      field('object', $._expression),
      '[',
      field('subscript', $._expression),
      ']'
    )),

    // Components
    parameters: $ => seq(
      '(',
      sep($.parameter, ','),
      ')'
    ),

    parameter: $ => seq(
      optional('mut'),
      field('name', $.identifier),
      optional(seq(':', field('type', $._type))),
      optional(seq('=', field('default', $._expression)))
    ),

    arguments: $ => seq(
      '(',
      sep($._expression, ','),
      ')'
    ),

    _type: $ => choice(
      $.identifier,
      $.builtin_types,
      $.generic_type
    ),

    generic_type: $ => seq(
      field('name', $.identifier),
      '[',
      sep1($._type, ','),
      ']'
    ),

    modifier: $ => choice(
      'pub', 'static', 'abstract', 'virtual', 'override', 'extern', 'unsafe',
      'let', 'const', 'mut'
    ),

    // Identifiers and Literals
    identifier: $ => /[A-Za-z_][\w]*/,
    identifier_dotted: $ => /[A-Za-z_][\w.]*/,

    number: $ => token(choice(
      /0[xX][0-9a-fA-F][0-9a-fA-F_]*/,
      /0[bB][01][01_]*/,
      /0[oO][0-7][0-7_]*/,
      /[0-9][0-9_]*\.[0-9][0-9_]*(?:[eE][+-]?[0-9][0-9_]*)?(?:f32|f64)?/,
      /[0-9][0-9_]*[eE][+-]?[0-9][0-9_]*(?:f32|f64)?/,
      /[0-9][0-9_]*(?:i8|i16|i32|i64|i128|u8|u16|u32|u64|u128)?/
    )),

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

    boolean: $ => choice('true', 'false', 'gaskiya', 'karya'),
    none: $ => choice('none', 'null', 'babu'),
    self: $ => 'self',

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

    builtin_exceptions: $ => choice(
      'Exception', 'ValueError', 'TypeError', 'RuntimeError', 'IOError',
      'OSError', 'NameError', 'KeyError', 'IndexError', 'AttributeError',
      'ImportError', 'MemoryError', 'RecursionError', 'NotImplementedError',
      'StopIteration', 'SystemExit', 'KeyboardInterrupt', 'ZeroDivisionError',
      'OverflowError', 'FileNotFoundError', 'PermissionError', 'TimeoutError',
      'ArithmeticError', 'LookupError'
    ),

    line_comment: $ => /#.*/
  }
});

function sep(rule, separator) {
  return optional(sep1(rule, separator));
}

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}
