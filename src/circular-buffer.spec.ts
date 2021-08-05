import { CircularBuffer } from './circular-buffer';

interface ExpectState {
  buffer: CircularBuffer<number>;
  array: number[];
  peek?: number;
  minus: (number | undefined)[];
  plus: (number | undefined)[];
}

test('push/pop', () => {
  const buffer = new CircularBuffer<number>(3);

  expect(buffer.getCapacity()).toEqual(3);

  expectState({
    buffer,
    peek: undefined,
    array: [],
    plus: [undefined, undefined, undefined, undefined],
    minus: [undefined, undefined, undefined, undefined],
  });

  buffer.push(1);
  expectState({
    buffer,
    peek: 1,
    array: [1],
    plus: [1, undefined, undefined, 1],
    minus: [1, undefined, undefined, 1],
  });

  buffer.push(2);
  expectState({
    buffer,
    peek: 2,
    array: [1, 2],
    plus: [1, 2, undefined, 1],
    minus: [2, 1, undefined, 2],
  });

  buffer.push(3);
  expectState({
    buffer,
    peek: 3,
    array: [1, 2, 3],
    plus: [1, 2, 3, 1],
    minus: [3, 2, 1, 3],
  });

  buffer.push(4);
  expectState({
    buffer,
    peek: 4,
    array: [2, 3, 4],
    plus: [2, 3, 4, 2],
    minus: [4, 3, 2, 4],
  });

  buffer.push(5);
  expectState({
    buffer,
    peek: 5,
    array: [3, 4, 5],
    plus: [3, 4, 5, 3],
    minus: [5, 4, 3, 5],
  });

  expect(buffer.pop()).toEqual(5);
  expectState({
    buffer,
    peek: 4,
    array: [3, 4],
    plus: [3, 4, undefined, 3],
    minus: [4, 3, undefined, 4],
  });

  expect(buffer.pop()).toEqual(4);
  expectState({
    buffer,
    peek: 3,
    array: [3],
    plus: [3, undefined, undefined, 3],
    minus: [3, undefined, undefined, 3],
  });

  expect(buffer.pop()).toEqual(3);
  expectState({
    buffer,
    peek: undefined,
    array: [],
    plus: [undefined, undefined, undefined, undefined],
    minus: [undefined, undefined, undefined, undefined],
  });
});

test('shift', () => {
  const buffer = new CircularBuffer<number>(3);
  buffer.push(1);
  expect(buffer.shift()).toBe(1);
  expectState({
    buffer,
    peek: undefined,
    array: [],
    plus: [undefined, undefined, undefined, undefined],
    minus: [undefined, undefined, undefined, undefined],
  });

  buffer.push(1);
  buffer.push(2);
  buffer.push(3);
  expectState({
    buffer,
    peek: 3,
    array: [1, 2, 3],
    plus: [1, 2, 3, 1],
    minus: [3, 2, 1, 3],
  });

  expect(buffer.shift()).toBe(1);
  expect(buffer.shift()).toBe(2);
  expectState({
    buffer,
    peek: 3,
    array: [3],
    plus: [3, undefined, undefined, 3],
    minus: [3, undefined, undefined, 3],
  });

  expect(buffer.shift()).toBe(3);
  expectState({
    buffer,
    peek: undefined,
    array: [],
    plus: [undefined, undefined, undefined, undefined],
    minus: [undefined, undefined, undefined, undefined],
  });
});

test('push overflow', () => {
  const buffer = new CircularBuffer<number>(3, true);

  buffer.push(1);
  buffer.push(2);
  buffer.push(3);
  buffer.push(4);
  expectState({
    buffer,
    peek: 4,
    array: [4, 2, 3],
    plus: [4, 2, 3, 4],
    minus: [4, 3, 2, 4],
  });
});

function expectState(state: ExpectState) {
  expect(state.buffer.peek()).toEqual(state.peek);
  expect(state.buffer.toArray()).toEqual(state.array);

  expect(state.buffer.peek(0)).toEqual(state.plus[0]);
  expect(state.buffer.peek(1)).toEqual(state.plus[1]);
  expect(state.buffer.peek(2)).toEqual(state.plus[2]);
  expect(state.buffer.peek(3)).toEqual(state.plus[3]);

  expect(state.buffer.peek(-1)).toEqual(state.minus[0]);
  expect(state.buffer.peek(-2)).toEqual(state.minus[1]);
  expect(state.buffer.peek(-3)).toEqual(state.minus[2]);
  expect(state.buffer.peek(-4)).toEqual(state.minus[3]);
}
