import { EXPRESSION_SPEC } from '../constants';
import { ExpressionNode, LiteralNode, LiteralType, Operator } from '../models';
import { Tokenizer, TokenTypes } from '../tokenizer';
import { BaseParser } from './BaseParser';

export class ExpressionParser extends BaseParser {
  protected tokenizer = new Tokenizer(EXPRESSION_SPEC);
  private code: string;

  public parse(code: string): unknown {
    this.code = code;
    this.tokenizer.init(this.code);
    this._lookahead = this.tokenizer.getNextToken();

    return this.expression();
  }

  public expression(): unknown {
    const left = this.literal();

    if (!this.tokenizer.isAnyTokenLeft()) {
      return left.value;
    }

    return `${this.code}`;
  }

  public operator(): Operator {
    const token = this._eat(TokenTypes.Operator);

    return token.value as Operator;
  }

  public literal(): LiteralNode {
    switch (this._lookahead.type) {
      case TokenTypes.Number:
        return this.number();
      case TokenTypes.Boolean:
        return this.boolean();
      case TokenTypes.StringSingle:
        return this.stringSingleQuotes();
      case TokenTypes.StringDouble:
        return this.stringDoubleQuotes();
      case TokenTypes.Identifier:
        return this.identifier();
      default:
        throw new Error(`Unexpected token ${this._lookahead.type}. Expected Literal`);
    }
  }

  public number(): LiteralNode {
    const token = this._eat(TokenTypes.Number);

    return {
      type: LiteralType.Number,
      value: Number(token.value),
    };
  }

  public boolean(): LiteralNode {
    const token = this._eat(TokenTypes.Boolean);

    return {
      type: LiteralType.Boolean,
      value: token.value === 'true' ? true : false,
    };
  }

  public identifier(): LiteralNode {
    const token = this._eat(TokenTypes.Identifier);

    return {
      type: LiteralType.Identifier,
      value: token.value,
    };
  }

  private stringSingleQuotes(): LiteralNode {
    const token = this._eat(TokenTypes.StringSingle);

    return {
      type: LiteralType.String,
      value: String(token.value.slice(1, -1)),
    };
  }

  private stringDoubleQuotes(): LiteralNode {
    const token = this._eat(TokenTypes.StringDouble);

    return {
      type: LiteralType.String,
      value: String(token.value.slice(1, -1)),
    };
  }
}
