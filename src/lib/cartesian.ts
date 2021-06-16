/**
 * @see https://stackoverflow.com/a/43053803/3728261
 */
import { limits } from '../limits';

export default function cartesian(...values: string[][]): string[][] {
  // @ts-ignore
  let out: string[][] = values.reduce((matrix: string[][], current: string[]) => {
    if (matrix.length > limits.outputs) {
      throw new RangeError(`Command exceeds the maximum of ${limits.outputs} outputs`);
    }

    return matrix.flatMap((d: string | string[]) => current.map((e: string) => [d, e].flat()));
  });

  if (out?.[0] && typeof out[0] === 'string') {
    out = out.map((i) => [i]) as unknown as string[][];
  }

  return out;
}
