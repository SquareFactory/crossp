export default function compiler(command: string): string[] {
  /**
   * Examples:
   *  command = 'python train.py --epochs=%[10,20,30]%'
   *  match = ['python train.py --epochs=%[10,20,30]%', 'python train.py --epochs=', '[10,20,30]']
   *
   *  command = 'python train.py --epochs=%(10,20,5)%'
   *  match = ['python train.py --epochs=%[10,20,30]%', 'python train.py --epochs=', '(10,20,5)', ',20,5']
   * **/
  const re = /([ -.\w]*=)%(\[[\w.]+([,.\w]+)*\]|\(\d+(.\d+)?([,-?\d+(.\d+)?]+){1,2}\))%/;
  const match = command.match(re) as string[];

  if (!match) {
    /** Match if there are nested lists **/
    const nestedListsRe = /[ -.\w]*=%(\(|\[)[\d,%\[\]\(\)]+(\)|\])%/gm;
    if (command.match(nestedListsRe) as string[]) throw new Error('Nested statements');

    /** Match if the list is empty **/
    const emptyListRe = /([ -.\w]*=)%(\[\]|\(\))%/gm;
    if (command.match(emptyListRe) as string[]) throw new Error('Empty comma-separated list');

    /** Match if the command is partially or totally missing the syntax '%(', ')%' or '%[', ']%' **/
    const missingSyntaxRe = /([ -.\w]*=)%?(\[?[\w.]+[,.\w+]*\]?|\(?\d+(.\d+)?([,-?\d+(.\d+)?]+){1,2}\)?)%?/gm;
    if (command.match(missingSyntaxRe) as string[]) throw new Error('Unterminated statement');
    return [command];
  }

  let output: string[] = [];
  const [_, commandText, commandList] = match;
  const isRange = commandList[0] === '(';
  const list = commandList.replace(/((,?\))|(,?\])|\(|\[)/gm, '').split(',');

  if (isRange) {
    let [min, max, range] = [parseFloat(list[0]), parseFloat(list[1]), 1];

    if (list.length === 3) {
      /** If the user gave a custom range. **/
      range = parseFloat(list[2]);
    }

    if (range < 0) {
      [max, min] = [min, max];
      range = -range;
    }

    for (let k = min; k <= max; k += range) {
      output.push(commandText.concat(k.toString()));
    }
  } else {
    list.forEach((i) => {
      if (i.length > 0) return output.push(commandText.concat(i));
    });
  }

  return output;
}
