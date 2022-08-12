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
  Text = 'text',
  Attribute = 'attribute',
  DynamicAttribute = 'dynamic-attribute',
  EventAttribute = 'event-attribute',
}

const SPEC: [RegExp, TokenTypes | null][] = [
  [/^\s+/, null],
  [/^(<\/[^>]*>)/, TokenTypes.TagClose],
  [/^>/, TokenTypes.TagEnd],
  [/^</, TokenTypes.TagStart],
  [/^@[aA-z-]*=".*?"/, TokenTypes.EventAttribute],
  [/^:[aA-z-]*=".*?"/, TokenTypes.DynamicAttribute],
  [/^[aA-z-]*=".*?"/, TokenTypes.Attribute],
  [/^[^\s<>]+/, TokenTypes.Text],
];

export class Tokenizer implements TokenizerInterface {
  private _code: string;
  private _index: number;

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

    for (const [regEx, tokenType] of SPEC) {
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
