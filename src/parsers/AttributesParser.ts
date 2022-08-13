import { AttributeNode, DynamicAttributeNode } from '../models';
import { ATTRIBUTE_SPEC } from '../constants';

import { Tokenizer, TokenTypes } from '../tokenizer';
import { BaseParser } from './BaseParser';
import { ExpressionParser } from './ExpressionParser';

export class AttributeParser extends BaseParser {
  protected readonly tokenizer = new Tokenizer(ATTRIBUTE_SPEC);
  private readonly expressionParser = new ExpressionParser();

  private code: string;

  public parse(code: string): (AttributeNode | DynamicAttributeNode)[] {
    this.code = code;

    this.tokenizer.init(this.code);
    this._lookahead = this.tokenizer.getNextToken();

    return this.getAttributes();
  }

  public getAttributes(): (AttributeNode | DynamicAttributeNode)[] {
    const attributes = [];

    while (this._lookahead.type !== TokenTypes.TagEnd) {
      attributes.push(this.getAttribute());
    }

    return attributes;
  }

  private getAttribute(): AttributeNode | DynamicAttributeNode {
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

  private attribute(): AttributeNode {
    const attributeToken = this._eat(TokenTypes.Attribute);
    const [left, right] = attributeToken.value.split('=');

    return {
      left,
      right: right.slice(1, -1),
      isDynamic: false,
    };
  }

  private dynamicAttribute(): DynamicAttributeNode {
    const attributeToken = this._eat(TokenTypes.DynamicAttribute);
    const [left, ...restRight] = attributeToken.value.split('=');
    const right = restRight.join('=');

    const expression = this.expressionParser.parse(right.slice(1, -1));

    return {
      left: left.slice(1),
      right: expression,
      isDynamic: true,
    };
  }

  private eventAttribute(): DynamicAttributeNode {
    const attributeToken = this._eat(TokenTypes.EventAttribute);
    const [left, ...restRight] = attributeToken.value.split('=');
    const right = restRight.join('=');

    const expression = this.expressionParser.parse(right.slice(1, -1));

    return {
      left: left.slice(1),
      right: expression,
      isDynamic: true,
    };
  }
}
