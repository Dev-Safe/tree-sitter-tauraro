/**
 * @file Tree-sitter grammar for the tauraro programming language
 * @author ken-morel <me@engon.cm>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "tauraro",

  // Tells tree-sitter how to distinguish keywords from longer identifiers starting with those keywords
  word: $ => $.identifier,

  // Tell the GLR parser how to handle ambiguous optional semicolons
  conflicts: $ => [
    [$.expression_statement, $.call_expression],
    [$.expression_statement, $.binary_expression],
    [$.variable_declaration, $.call_expression],
    [$.variable_declaration, $.binary_expression],
    [$.variable_declaration, $.expression_statement]
  ],

  // Explicit, named precedence levels in ascending order (lowest to highest)
  precedences: $ => [
    [
      'lambda',
      'assign',
      'or',
      'and',
      'comparative',
      'shift',
      'additive',
      'multiplicative',
      'power',
      'coalesce',
      'unary',
      'call',
      'member'
    ]
  ],

  extras: $ => [
    /\s/,
    $.line_comment,
  ],

  rules: {
    source_file: $ => repeat($._statement),

    _statement: $ => choice(
      $.decorator,
      $.class_definition,
      $.function_definition,
      $.interface_definition,
      $.enum_definition,
      $.struct_definition,
      $.extend_definition,
      $.import_statement,
      $.variable_declaration,
      $.expression_statement
    ),

    decorator: $ => seq(
      '@',
      $.dotted_identifier
    ),

    dotted_identifier: $ => seq(
      $.identifier,
      repeat(seq('.', $.identifier))
    ),

    class_definition: $ => seq(
      repeat($.keyword_modifier),
      choice('class', 'aji'),
      field('name', $.type_identifier),
      optional($.type_parameters),
      optional($.class_body)
    ),

    function_definition: $ => seq(
      repeat($.keyword_modifier),
      choice('def', 'aiki'),
      field('name', $.identifier),
      optional($.type_parameters),
      $.parameters,
      optional(seq('->', $.type_annotation)),
      optional($.block)
    ),

    interface_definition: $ => seq(
      repeat($.keyword_modifier),
      'interface',
      field('name', $.type_identifier),
      optional($.type_parameters),
      optional($.class_body)
    ),

    enum_definition: $ => seq(
      repeat($.keyword_modifier),
      'enum',
      field('name', $.type_identifier),
      optional($.type_parameters),
      optional($.enum_body)
    ),

    struct_definition: $ => seq(
      repeat($.keyword_modifier),
      choice('struct', 'tsari'),
      field('name', $.type_identifier),
      optional($.type_parameters),
      optional($.class_body)
    ),

    extend_definition: $ => seq(
      repeat($.keyword_modifier),
      'extend',
      field('name', $.type_identifier),
      optional($.type_parameters),
      optional($.class_body)
    ),

    import_statement: $ => choice(
      seq(
        'from',
        field('module', $.namespace_identifier),
        'import',
        choice(
          $.identifier,
          seq('(', commaSep1($.identifier), optional(','), ')')
        )
      ),
      seq(
        'import',
        field('module', $.namespace_identifier)
      )
    ),

    variable_declaration: $ => seq(
      choice(
        // Case 1: Modifiers exist. Type annotation is optional.
        seq(
          repeat1($.keyword_modifier),
          $.identifier,
          optional(seq(':', $.type_annotation))
        )
        // Case 2: No modifiers. Type annotation is required to distinguish from expression statements like 'x = 5;'
        // seq(
        //   $.identifier,
        //   seq(':', $.type_annotation)
        // )
      ),
      optional(seq('=', $.expression)),
      optional(';')
    ),

    expression_statement: $ => seq(
      $.expression,
      optional(';')
    ),

    type_parameters: $ => seq('[', commaSep1($.type_annotation), ']'),

    type_annotation: $ => choice(
      $.builtin_types,
      $.type_generic,
      $.type_identifier
    ),

    type_generic: $ => seq(
      field('base', $.type_identifier),
      '[',
      commaSep1($.type_annotation),
      ']'
    ),

    class_body: $ => seq(
      '{',
      repeat($._statement),
      '}'
    ),

    enum_body: $ => seq(
      '{',
      commaSep($.enum_variant),
      optional(','),
      '}'
    ),

    enum_variant: $ => seq(
      field('name', $.identifier),
      optional(seq('(', commaSep1($.type_annotation), ')'))
    ),

    parameters: $ => seq(
      '(',
      commaSep($.parameter),
      optional(','),
      ')'
    ),

    parameter: $ => seq(
      field('name', $.identifier),
      optional(seq(':', $.type_annotation))
    ),

    block: $ => seq(
      '{',
      repeat($._statement),
      '}'
    ),

    expression: $ => choice(
      $.primary_expression,
      $.binary_expression,
      $.unary_expression,
      $.assignment_expression,
      $.lambda_expression
    ),

    primary_expression: $ => choice(
      $.identifier,
      $.type_identifier,
      $.constants,
      $.self_keyword,
      $.string,
      $.number,
      $.call_expression,
      $.member_expression,
      $.parenthesized_expression
    ),

    parenthesized_expression: $ => seq(
      '(',
      $.expression,
      ')'
    ),

    call_expression: $ => prec.left('call', seq(
      field('function', $.expression),
      '(',
      commaSep($.expression),
      optional(','),
      ')'
    )),

    member_expression: $ => prec.left('member', seq(
      field('object', $.expression),
      '.',
      field('property', $.identifier)
    )),

    binary_expression: $ => {
      const table = [
        ['or', choice('or', 'ko')],
        ['and', choice('and', 'da')],
        ['comparative', choice('==', '!=', '<', '<=', '>', '>=', 'is', 'in')],
        ['shift', choice('<<', '>>', '&', '|', '^')],
        ['additive', choice('+', '-')],
        ['multiplicative', choice('*', '/', '%', '//')],
        ['power', '**', prec.right],
        ['coalesce', choice('??', '!!')]
      ];

      return choice(...table.map(([precedenceName, operator, assoc = prec.left]) => assoc(precedenceName, seq(
        field('left', $.expression),
        field('operator', operator),
        field('right', $.expression)
      ))));
    },

    unary_expression: $ => prec('unary', seq(
      field('operator', choice('not', 'ba', '-', '+', '~', '!', '?')),
      field('argument', $.expression)
    )),

    assignment_expression: $ => prec.right('assign', seq(
      field('left', $.expression),
      field('operator', choice(
        '=', ':=', '<-', '~>',
        '+=', '-=', '*=', '/=', '%=',
        '**=', '//=', '&=', '|=', '^=',
        '<<=', '>>='
      )),
      field('right', $.expression)
    )),

    lambda_expression: $ => prec('lambda', seq(
      'lambda',
      $.parameters,
      '=>',
      choice($.expression, $.block)
    )),

    // --- TERMINALS ---

    line_comment: $ => /#.*/,

    keyword_modifier: $ => choice(
      'pub', 'mut', 'static', 'const', 'abstract', 'virtual', 'override', 'let'
    ),

    builtin_types: $ => token(choice(
      'str', 'int', 'i8', 'i16', 'i32', 'i64', 'i128', 'u8', 'u16', 'u32', 'u64',
      'u128', 'f32', 'f64', 'bool', 'char', 'void', 'List', 'Dict', 'Tuple',
      'Set', 'Option', 'Result', 'Box', 'Vec', 'String', 'Bytes', 'Any',
      'Never', 'Self', 'Map', 'Pointer'
    )),

    constants: $ => choice(
      'true', 'false', 'none', 'null', 'gaskiya', 'karya', 'babu'
    ),

    self_keyword: $ => 'self',

    string: $ => choice(
      // triple double-quoted string
      seq('"""', repeat(choice(/[^"\\]+/, $.escape_sequence, /"[^"\\]*/, /""[^"\\]*/)), '"""'),
      // triple single-quoted string
      seq("'''", repeat(choice(/[^'\\]+/, $.escape_sequence, /'[^'\\]*/, /''[^'\\]*/)), "'''"),
      // double-quoted string (with support for f, r, b prefixes)
      seq(
        optional(choice('f', 'r', 'b')),
        '"',
        repeat(choice(/[^"\\]+/, $.escape_sequence)),
        '"'
      ),
      // single-quoted string (with support for f, r, b prefixes)
      seq(
        optional(choice('f', 'r', 'b')),
        "'",
        repeat(choice(/[^'\\]+/, $.escape_sequence)),
        "'"
      )
    ),

    escape_sequence: $ => token(/\\([\\"'nrtbfav0]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8}|N\{[^}]+\})/),

    number: $ => token(choice(
      /0[xX][0-9a-fA-F][0-9a-fA-F_]*/,
      /0[bB][01][01_]*/,
      /0[oO][0-7][0-7_]*/,
      /[0-9][0-9_]*\.[0-9][0-9_]*([eE][+-]?[0-9][0-9_]*)?(f32|f64)?/,
      /[0-9][0-9_]*[eE][+-]?[0-9][0-9_]*(f32|f64)?/,
      /[0-9][0-9_]*(i8|i16|i32|i64|i128|u8|u16|u32|u64|u128)?/
    )),

    // Dotted structure parsed as discrete rules rather than a single string token to avoid colliding with the dot operator
    namespace_identifier: $ => seq(
      choice($.identifier, $.type_identifier),
      repeat(seq('.', choice($.identifier, $.type_identifier)))
    ),

    identifier: $ => /[a-z_][a-zA-Z0-9_]*/,

    type_identifier: $ => /[A-Z][a-zA-Z0-9_]*/
  }
});

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}
