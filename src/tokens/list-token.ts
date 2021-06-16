import { Token } from './token';

export class ListToken implements Token {
  readonly values: string[];

  constructor(raw: string) {
    this.values = raw
      .split(',')
      .map((val) => val.trim())
      .filter((val) => val.length > 0);

    if (this.values.length === 0) {
      throw new RangeError('Empty comma-separated list');
    }
  }
}
