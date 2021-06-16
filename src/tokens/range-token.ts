import { limits } from '../limits';
import { Token } from './token';

export class RangeToken implements Token {
  private readonly FLOAT_REGEX = /[+-]?(?:\d*[.])?\d+/;
  readonly start: number;
  readonly end: number;
  readonly increment: number;
  readonly values: string[] = [];

  constructor(readonly raw: string) {
    let parts = raw.trim().split(',');

    if (parts.length < 2 || parts.length > 3) {
      throw new SyntaxError('Invalid number of arguments for range');
    }

    if (
      !parts[0].match(this.FLOAT_REGEX) ||
      !parts[1].match(this.FLOAT_REGEX) ||
      (parts?.[2] && parts[2].length > 0 && !parts[2].match(this.FLOAT_REGEX))
    ) {
      throw new SyntaxError('Non numeric range parameters');
    }

    this.start = parseFloat(parts[0]);
    this.end = parseFloat(parts[1]);
    this.increment = Math.abs(parts?.[2] && parts[2].length > 0 ? parseFloat(parts[2]) : 1);

    if (this.increment === 0) {
      throw new RangeError('Increment cannot be equal to zero');
    }

    if (this.start > this.end) {
      [this.start, this.end] = [this.end, this.start];
    }

    if ((this.end - this.start) / this.increment > limits.range) {
      throw new RangeError(`Range operator exceeds the maximum allowed domain of ${limits.range} values`);
    }

    let current = this.start;

    while (current <= this.end) {
      this.values.push(current.toString(10));
      current += this.increment;
    }
  }
}
