import { TokenTypes } from './tokenizer';

export const MAIN_SPEC: [RegExp, TokenTypes | null][] = [
  [/^\s+/, null],
  [/^(<\/[^>]*>)/, TokenTypes.TagClose],
  [/^>/, TokenTypes.TagEnd],
  [/^</, TokenTypes.TagStart],
  [/^@[aA-z-]*=".*?"/, TokenTypes.EventAttribute],
  [/^:[aA-z-]*=".*?"/, TokenTypes.DynamicAttribute],
  [/^[aA-z-]*=".*?"/, TokenTypes.Attribute],
  [/^[^\s<>]+/, TokenTypes.Text],
];

export const EXPRESSION_SPEC: [RegExp, TokenTypes | null][] = [
  [/^\s+/, null],
  [/^=+/, TokenTypes.Equals],
  [/^\d+/, TokenTypes.Number],
  [/^'.*'/, TokenTypes.StringSingle],
  [/^".*"/, TokenTypes.StringDouble],
  [/^[+-]/, TokenTypes.Operator],
  [/^([^\d]\w+)/, TokenTypes.Identifier],
];
