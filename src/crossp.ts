import cartesian from './lib/cartesian';
import placeholder from './lib/placeholder';
import { limits } from './limits';
import { ListToken } from './tokens/list-token';
import { RangeToken } from './tokens/range-token';
import { Token } from './tokens/token';

export default function crossp(command: string): string[] {
  if (command.length > limits.length) {
    throw new RangeError(`Command exceeds the maximum allowed length of ${limits.length} characters`);
  }

  let counter = 0;
  let work = command;
  const tokens: Token[] = [];

  let match: RegExpExecArray | null;
  const listRegex = /%\[([^\]]*)]%/g;
  while ((match = listRegex.exec(command)) !== null) {
    work = work.replace(match[0], placeholder(counter++));
    tokens.push(new ListToken(match[1]));
  }

  const rangeRegex = /%\(([^)]+)\)%/g;
  while ((match = rangeRegex.exec(command)) !== null) {
    work = work.replace(match[0], placeholder(counter++));
    tokens.push(new RangeToken(match[1]));
  }

  if (tokens.length === 0) {
    return [command];
  }

  const replacements = cartesian(...tokens.map((t) => t.values));
  const result: string[] = replacements.map((line) => {
    let acc = work;

    line.forEach((value, index) => {
      acc = acc.replace(placeholder(index), value);
    });

    return acc;
  });

  return result.sort();
}
