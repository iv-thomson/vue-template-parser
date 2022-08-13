import { ComponentParser } from './parsers/ComponentParser';

export class Parser {
  private componentParser: ComponentParser;

  constructor() {
    this.componentParser = new ComponentParser();
  }
  public parse(code: string) {
    return this.componentParser.parse(code);
  }
}
