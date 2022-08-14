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
  [/^\d+/, TokenTypes.Number],
  [/^'.*'/, TokenTypes.StringSingle],
  [/^".*"/, TokenTypes.StringDouble],
  [/^true|^false/, TokenTypes.Boolean],
  [/^\+|^-|^===|^\*|^\/|^>|^<|^>=|^<=|^&&|^\|\||^!|^\(|^\)/, TokenTypes.Operator],
  [/^(?!true$|false$|\d)\w+/, TokenTypes.Identifier],
];

export const COMPONENT_SPEC: [RegExp, TokenTypes | null][] = [
  [/^\s+/, null],
  [/^(<\/[^>]*>)/, TokenTypes.TagClose],
  [/^(<[^>]*>)/, TokenTypes.TagOpen],
  [/^[^\s<>]+/, TokenTypes.Text],
];

export const ATTRIBUTE_SPEC: [RegExp, TokenTypes | null][] = [
  [/^\s+/, null],
  [/^(<\/[^>]*>)/, TokenTypes.TagClose],
  [/^>/, TokenTypes.TagEnd],
  [/^</, TokenTypes.TagStart],
  [/^@[aA-z-]*=".*?"/, TokenTypes.EventAttribute],
  [/^:[aA-z-]*=".*?"/, TokenTypes.DynamicAttribute],
  [/^[aA-z-]*=".*?"/, TokenTypes.Attribute],
];
