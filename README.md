# `@csquare/crossp`

[![licence](https://img.shields.io/github/license/csquare-ai/crossp)](LICENSE)
[![version](https://img.shields.io/npm/v/@csquare/crossp)](https://www.npmjs.com/package/@csquare/crossp)
[![coverage](https://img.shields.io/codecov/c/github/csquare-ai/crossp)](https://app.codecov.io/gh/csquare-ai/crossp)

Generate a batch of commands based on single one.

Maintained by:

- [Mathieu Bour](https://github.com/mathieu-bour), Lead Platform Engineer at [Cohesive Computing SA](https://csquare.ai)
- [Clarisse Tarrou](https://github.com/ArcticSubmarine), Platform Engineer
  at [Cohesive Computing SA](https://csquare.ai)

## Installation

Install with npm:

```shell
npm install --save @csquare/crossp
```

Install with Yarn:

```shell
yarn add @csquare/crossp
```

## Usage

### Basic usage

Using CommonJS syntax:

```typescript
const { crossp } = require('@csquare/crossp');

const output = crossp();
```

Using ESM syntax (default import):

```typescript
import crossp from '@csquare/crossp';

const output = crossp();
```

or

```typescript
import { crossp } from '@csquare/crossp';

const output = crossp();
```

### Examples

<!-- prettier-ignore-start -->
```typescript
import crossp from '@csquare/crossp';

console.log(crossp('python train.py -e %[1,2]% -lr %[0.1,0.2]% -o %[in,out]%.txt'));

// console output:
[
  'python train.py -e 1 -lr 0.1 -o in.txt',
  'python train.py -e 1 -lr 0.1 -o out.txt',
  'python train.py -e 1 -lr 0.2 -o in.txt',
  'python train.py -e 1 -lr 0.2 -o out.txt',
  'python train.py -e 2 -lr 0.1 -o in.txt',
  'python train.py -e 2 -lr 0.1 -o out.txt',
  'python train.py -e 2 -lr 0.2 -o in.txt',
  'python train.py -e 2 -lr 0.2 -o out.txt',
];
```
<!-- prettier-ignore-end -->
