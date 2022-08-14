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
  attributes: AttributeNode[];
  children: ASTNode[];
}

export interface AttributeNode {
  left: string;
  right: unknown;
  isDynamic: boolean;
}

export interface DynamicAttributeNode {
  left: string;
  right: unknown;
  isDynamic: boolean;
}

export interface ExpressionNode {
  value: string;
}

export interface LiteralNode {
  type: LiteralType;
  value: unknown;
}
