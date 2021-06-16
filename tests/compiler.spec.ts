import compiler from '../src/compiler';

describe('compiler', () => {
  //OK
  it.each(['python train.py', 'hello world', 'foo bar'])(
    'should be a no-op for commands without the syntax',
    (command) => {
      expect(compiler(command)).toStrictEqual([command]);
    },
  );

  //OK
  it.each([
    [
      'python train.py --epochs=%[10,20,30]%',
      ['python train.py --epochs=10', 'python train.py --epochs=20', 'python train.py --epochs=30'],
    ],
  ])('should compile %p using comma-separated lists', (command, compiled) => {
    expect(compiler(command)).toStrictEqual(compiled.sort());
  });

  //OK
  it.each([['python train.py --epochs=%[10,20,]%', ['python train.py --epochs=10', 'python train.py --epochs=20']]])(
    'should compile %p using comma-separated lists with a trailing comma',
    (command, compiled) => {
      expect(compiler(command)).toStrictEqual(compiled.sort());
    },
  );

  //OK
  it.each([
    [
      'python train.py --epochs=%(10,20,5)%',
      ['python train.py --epochs=10', 'python train.py --epochs=15', 'python train.py --epochs=20'],
    ],
    ['python train.py --epochs=%(10,20,7)%', ['python train.py --epochs=10', 'python train.py --epochs=17']],
    ['python train.py --epochs=%(10,20,99)%', ['python train.py --epochs=10']],
  ])('should compile %p using ranges', (command, compiled) => {
    expect(compiler(command)).toStrictEqual(compiled.sort());
  });

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
  ])('should compile %p using decimal ranges', (command, compiled) => {
    expect(compiler(command)).toStrictEqual(compiled.sort());
  });

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
  ])('should compile %p using ranges with default increment', (command, compiled) => {
    expect(compiler(command)).toStrictEqual(compiled.sort());
  });

  //OK
  it.each([
    [
      'python train.py --epochs=%(12,10,-1)%',
      ['python train.py --epochs=10', 'python train.py --epochs=11', 'python train.py --epochs=12'],
    ],
  ])('should compile %p using decrementing ranges', (command, compiled) => {
    expect(compiler(command)).toStrictEqual(compiled.sort());
  });

  //OK
  it.each([
    ['python train.py --epochs=%(10,15,2', 'Unterminated statement'],
    ['python train.py --epochs=%[]%', 'Empty comma-separated list'],
    ['python train.py --epochs=%(10,%[1,2,3]%,2)%', 'Nested statements'],
  ])('should throw a syntax error for %p', (command, message) => {
    expect(() => compiler(command)).toThrowError(message);
  });
});
