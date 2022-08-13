import { ASTComponentNode, ASTNode, NodeType } from '../models';
import { COMPONENT_SPEC } from '../constants';
import { Tokenizer, TokenTypes } from '../tokenizer';
import { AttributeParser } from './AttributesParser';
import { BaseParser } from './BaseParser';

export class ComponentParser extends BaseParser {
  protected tokenizer = new Tokenizer(COMPONENT_SPEC);

  private code: string;

  private attributeParser = new AttributeParser();

  public parse(code: string): ASTComponentNode {
    this.code = code;
    this.tokenizer.init(this.code);
    this._lookahead = this.tokenizer.getNextToken();

    return this.component();
  }

  public component(): ASTComponentNode {
    const tag = this._eat(TokenTypes.TagOpen);

    const [nameRaw, ...restAttributes] = tag.value.split(' ');
    const attributesRaw = restAttributes.join(' ');

    const attributes = attributesRaw ? this.attributeParser.parse(attributesRaw) : [];
    const name = nameRaw.replace('<', '').replace('>', '');

    const children = this.getChildren(name);

    this._eat(TokenTypes.TagClose);

    return {
      type: NodeType.Component,
      value: name,
      attributes,
      children,
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
      case TokenTypes.TagOpen:
        return this.component();
      default:
        return this.text();
    }
  }

  public text(): ASTNode {
    let value = '';

    while (![TokenTypes.TagOpen, TokenTypes.TagClose].includes(this._lookahead.type)) {
      const textNode = this._eat(this._lookahead.type);
      const space = ' ';
      value += `${textNode.value}${space}`;
    }

    return {
      type: NodeType.Text,
      value,
    };
  }
}
