import crossp from '../src/crossp';
import { limits } from '../src/limits';

function expectToEqual(command: string, outputs: string[]) {
  expect(crossp(command)).toStrictEqual(outputs.sort());
}

function expectToThrow(command: string, message: string) {
  expect(() => crossp(command)).toThrow(message);
}

describe('compiler', () => {
  it.each(['python train.py', 'hello world', 'foo bar'])(
    'should be a no-op for commands without the syntax',
    (command) => {
      expectToEqual(command, [command]);
    },
  );

  it.each([
    [
      'python train.py --epochs=%[10,20,30]%',
      ['python train.py --epochs=10', 'python train.py --epochs=20', 'python train.py --epochs=30'],
    ],
  ])('should compile %p using comma-separated lists', expectToEqual);

  it.each([['python train.py --epochs=%[10,20,]%', ['python train.py --epochs=10', 'python train.py --epochs=20']]])(
    'should compile %p using comma-separated lists with a trailing comma',
    expectToEqual,
  );

  it.each([
    [
      'python train.py --epochs=%(10,20,5)%',
      ['python train.py --epochs=10', 'python train.py --epochs=15', 'python train.py --epochs=20'],
    ],
    ['python train.py --epochs=%(10,20,7)%', ['python train.py --epochs=10', 'python train.py --epochs=17']],
    ['python train.py --epochs=%(10,20,99)%', ['python train.py --epochs=10']],
  ])('should compile %p using ranges', expectToEqual);

  //OK
  it.each([
    [
      'python train.py --lr=%(0.01,0.10,0.03)%',
      [
        'python train.py --lr=0.01',
        'python train.py --lr=0.04',
        'python train.py --lr=0.07',
        'python train.py --lr=0.1',
      ],
    ],
  ])('should compile %p using decimal ranges', expectToEqual);

  //OK
  it.each([
    [
      'python train.py --epochs=%(10,12)%',
      ['python train.py --epochs=10', 'python train.py --epochs=11', 'python train.py --epochs=12'],
    ],
    [
      'python train.py --epochs=%(10,12,)%', // Trailing comma
      ['python train.py --epochs=10', 'python train.py --epochs=11', 'python train.py --epochs=12'],
    ],
  ])('should compile %p using ranges with default increment', expectToEqual);

  it.each([
    [
      'python train.py --epochs=%(12,10,-1)%',
      ['python train.py --epochs=10', 'python train.py --epochs=11', 'python train.py --epochs=12'],
    ],
  ])('should compile %p using decrementing ranges', expectToEqual);

  it.each([
    [
      'python train.py -e %[1,2]% -lr %[0.1,0.2]% -o %[in,out]%.txt',
      [
        'python train.py -e 1 -lr 0.1 -o in.txt',
        'python train.py -e 1 -lr 0.1 -o out.txt',
        'python train.py -e 1 -lr 0.2 -o in.txt',
        'python train.py -e 1 -lr 0.2 -o out.txt',
        'python train.py -e 2 -lr 0.1 -o in.txt',
        'python train.py -e 2 -lr 0.1 -o out.txt',
        'python train.py -e 2 -lr 0.2 -o in.txt',
        'python train.py -e 2 -lr 0.2 -o out.txt',
      ],
    ],
    [
      'python train.py -e %(1,2)% -lr %(0.1,0.2)% -o %[in,out]%.txt',
      [
        'python train.py -e 1 -lr 0.1 -o in.txt',
        'python train.py -e 1 -lr 0.1 -o out.txt',
        'python train.py -e 2 -lr 0.1 -o in.txt',
        'python train.py -e 2 -lr 0.1 -o out.txt',
      ],
    ],
  ])('should compile %p using multi-statements', expectToEqual);

  it.each([
    ['python train.py --epochs=%[]%', 'Empty comma-separated list'],
    ['python train.py --epochs=%(10,%[1,2,3]%,2)%', 'Invalid number of arguments for range'],
    ['python train.py --epochs=%(in,out,1)%', 'Non numeric range parameters'],
    ['python train.py --epochs=%(1,10,0)%', 'Increment cannot be equal to zero'],
  ])('should throw a syntax error for %p', expectToThrow);

  it.each([
    [
      `python train.py ${new Array(limits.length * 2).join('#')}`,
      `Command exceeds the maximum allowed length of ${limits.length} characters`,
    ],
    [
      'python train.py --foo=%(0,1,0.000001)%',
      `Range operator exceeds the maximum allowed domain of ${limits.range} values`,
    ],
  ])('should not compile %p and be rate limited', expectToThrow);
});
