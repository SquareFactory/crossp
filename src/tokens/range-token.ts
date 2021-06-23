import BigNumber from 'bignumber.js';
import { limits } from '../limits';
import { Token } from './token';

export class RangeToken implements Token {
  private readonly FLOAT_REGEX = /[+-]?(?:\d*[.])?\d+/;
  readonly start: BigNumber;
  readonly end: BigNumber;
  readonly increment: BigNumber;
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

    this.start = new BigNumber(parts[0]);
    this.end = new BigNumber(parts[1]);
    this.increment = parts?.[2] && parts[2].length > 0 ? new BigNumber(parts[2]).abs() : new BigNumber(1);

    if (this.increment.eq(0)) {
      throw new RangeError('Increment cannot be equal to zero');
    }

    if (this.start.gt(this.end)) {
      [this.start, this.end] = [this.end, this.start];
    }

    if (this.end.minus(this.start).div(this.increment).gt(limits.range)) {
      throw new RangeError(`Range operator exceeds the maximum allowed domain of ${limits.range} values`);
    }

    let current = new BigNumber(this.start);

    while (current.lte(this.end)) {
      this.values.push(current.toString(10));
      current = current.plus(this.increment);
    }
  }
}
