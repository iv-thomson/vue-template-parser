import { Token, Tokenizer, TokenizerInterface, TokenTypes } from './tokenizer';

export class Parser {
  private tokenizer: TokenizerInterface;
  private code: string;

  private _lookahead: Token | null;

  constructor() {
    this.tokenizer = new Tokenizer();
  }
  public parse(code: string) {
    this.code = code;
    this.tokenizer.init(this.code);
    this._lookahead = this.tokenizer.getNextToken();

    return this.component();
  }

  public component() {
    this._eat(TokenTypes.TagStart);
    const nameToken = this._eat(TokenTypes.Text);
    const attributes = this.getAttributes();
    this._eat(TokenTypes.TagEnd);

    const name = `${nameToken.value}`;

    const children = this.getChildren(name);

    this._eat(TokenTypes.TagClose);
    return {
      type: 'Component',
      value: name,
      attributes,
      children,
    };
  }

  private getAttributes() {
    const attributes = [];

    while (this._lookahead.type !== TokenTypes.TagEnd) {
      attributes.push(this.getAttribute());
    }

    return attributes;
  }

  private getAttribute() {
    switch (this._lookahead.type) {
      case TokenTypes.DynamicAttribute:
        return this.dynamicAttribute();
      case TokenTypes.Attribute:
        return this.attribute();
      case TokenTypes.EventAttribute:
        return this.eventAttribute();
      default:
        throw new SyntaxError(
          `Unexpected token  ${this._lookahead.type}. Expected: ${TokenTypes.Attribute} or ${TokenTypes.DynamicAttribute}`
        );
    }
  }

  private attribute() {
    const attributeToken = this._eat(TokenTypes.Attribute);
    const [left, right] = attributeToken.value.split('=');

    return {
      type: 'Attribute',
      left,
      right: right.slice(1, -1),
      dynamic: false,
    };
  }

  private dynamicAttribute() {
    const attributeToken = this._eat(TokenTypes.DynamicAttribute);
    const [left, right] = attributeToken.value.split('=');

    return {
      type: 'Attribute',
      left: left.slice(1),
      right: right.slice(1, -1),
      dynamic: true,
    };
  }

  private eventAttribute() {
    const attributeToken = this._eat(TokenTypes.EventAttribute);
    const [left, right] = attributeToken.value.split('=');

    return {
      type: 'Attribute',
      left: left.slice(1),
      right: right.slice(1, -1),
      dynamic: true,
    };
  }

  private getChildren(name: string) {
    const children = [];
    const lookaheadName = `${this._lookahead.value.slice(1, -1)}`;

    while (this._lookahead.type !== TokenTypes.TagClose && lookaheadName !== name) {
      children.push(this.child());
    }

    return children;
  }

  private child() {
    switch (this._lookahead.type) {
      case TokenTypes.TagStart:
        return this.component();
      default:
        return this.text();
    }
  }

  public text() {
    let value = '';

    while (![TokenTypes.TagStart, TokenTypes.TagClose].includes(this._lookahead.type)) {
      console.log(this._lookahead);
      const textNode = this._eat(this._lookahead.type);
      const space = ' ';
      value += `${textNode.value}${space}`;
    }

    return {
      type: 'Text',
      value,
    };
  }

  private _eat(tokenType: TokenTypes) {
    const token = this._lookahead;

    if (token === null) {
      throw new SyntaxError(`Unexpected end of input. Expected: ${tokenType}`);
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(`Unexpected token ${token.type}. Expected: ${tokenType}`);
    }

    this._lookahead = this.tokenizer.getNextToken();
    return token;
  }
}
