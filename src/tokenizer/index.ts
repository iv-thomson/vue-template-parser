export interface TokenizerInterface {
  getNextToken(): Token | null;
  isEndOfString(): boolean;
  init(code: string): void;
}

export interface Token {
  type: TokenTypes;
  value: string;
}

export enum TokenTypes {
  TagStart = 'tag-start',
  TagEnd = 'tag-end',
  TagClose = 'tag-close',
  TagOpen = 'tag-open',
  Text = 'text',
  Attribute = 'attribute',
  DynamicAttribute = 'dynamic-attribute',
  EventAttribute = 'event-attribute',
  Number = 'number',
  StringSingle = 'string-single',
  StringDouble = 'string-double',
  Boolean = 'boolean',
  Operator = 'operator',
  Equals = 'equals',
  Identifier = 'identifier',
}

export class Tokenizer implements TokenizerInterface {
  private _code: string;
  private _index: number;

  constructor(private readonly spec: [RegExp, TokenTypes | null][]) {}

  public init(code: string): void {
    this._code = code;
    this._index = 0;
  }

  public isEndOfString(): boolean {
    return this._index === this._code.length;
  }

  public isAnyTokenLeft(): boolean {
    return this._index < this._code.length;
  }

  public getNextToken(): Token | null {
    if (!this.isAnyTokenLeft()) {
      return null;
    }

    const code = this._code.slice(this._index);

    for (const [regEx, tokenType] of this.spec) {
      const tokenValue = this._match(regEx, code);

      if (tokenValue === null) {
        continue;
      }

      if (tokenType === null) {
        return this.getNextToken();
      }

      return {
        value: tokenValue,
        type: tokenType,
      };
    }
    throw new SyntaxError(`Unexpected token "${code[0]}".`);
  }

  private _match(regEx: RegExp, code: string): string | null {
    const matched = regEx.exec(code);
    if (matched === null) {
      return null;
    }
    this._index += matched[0].length;
    return matched[0];
  }
}
