import { Token, TokenizerInterface, TokenTypes } from '../tokenizer';

export abstract class BaseParser {
  protected _lookahead: Token;

  constructor(protected tokenizer: TokenizerInterface) {}

  protected _eat(tokenType: TokenTypes) {
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
