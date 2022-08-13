export enum NodeType {
  Component = 'component',
  Text = 'text',
}

export enum LiteralType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Identifier = 'identifier',
}

export enum Operator {
  Plus = '+',
  Minus = '-',
  Equal = '=',
}

export interface ASTNode {
  type: NodeType;
  value: string;
}

export interface ASTComponentNode extends ASTNode {
  attributes: ASTNode[];
  children: ASTNode[];
}

export interface AttributeNode {
  left: string;
  right: string;
}

export interface DynamicAttributeNode {
  left: string;
  right: ExpressionNode;
}

export interface ExpressionNode {
  left: LiteralNode;
  right?: ExpressionNode | LiteralNode;
  operator?: Operator;
}

export interface LiteralNode {
  type: LiteralType;
  value: unknown;
}
