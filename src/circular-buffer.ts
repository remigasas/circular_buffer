export class CircularBuffer<T> {
  /** Holds index of next position to write */
  private writeIndex = 0;
  private readIndex = 0;
  private buffer: (T | undefined)[];

  /**
   * Create new circular buffer with a fixed capacity ( size ).
   * Buffer is operated with two indexes, read and write.
   * Writing more items than its capacity will overflow buffer, trying to read in such state can return newly written or oldest item
   * This depends on dontAdjustReadOnOverflow flag
   *
   * @param capacity - buffer size
   * @param dontAdjustReadOnOverflow - if false (default value) will increase read index ( effectivelly skipping it), if true doesn't change read index ( will return newly written )
   *
   */
  constructor(private capacity: number, private dontAdjustReadOnOverflow = false) {
    this.buffer = new Array<T>(capacity);
  }

  /**
   * Adds new item to the end of buffer. Writing more items can "overflow" buffer
   * @param item - new item to insert
   */
  push(item: T) {
    // writing to position that already has item
    if (this.buffer[this.writeIndex] !== undefined) {
      if (!this.dontAdjustReadOnOverflow) {
        this.readIndex = norm(this.readIndex + 1, this.capacity);
      }
    }
    this.buffer[this.writeIndex] = item;
    this.writeIndex = norm(this.writeIndex + 1, this.capacity);
  }

  /**
   * Returns (and removes from buffer) last inserted item
   */
  pop(): T | undefined {
    this.writeIndex = norm(this.writeIndex - 1, this.capacity);
    const item = this.buffer[this.writeIndex];
    this.buffer[this.writeIndex] = undefined;
    return item;
  }

  /**
   * Returns (and removes from buffer) first inserted item
   */
  shift() {
    const item = this.buffer[this.readIndex];
    this.buffer[this.readIndex] = undefined;
    this.readIndex = norm(this.readIndex + 1, this.capacity);
    return item;
  }

  /**
   * Returns item by index, but doesn't remove it from buffer
   *  If       no index is passed             - return last pushed item
   *  If negative index is passed             - return from the end ( -1 would be same as no param )
   *  If positive ( or zero ) index is passed - return from the start
   */
  peek(index?: number) {
    if (index === undefined || isNaN(index)) {
      return this.buffer[norm(this.writeIndex - 1, this.capacity)];
    } else if (index < 0) {
      return this.buffer[norm(this.writeIndex + index, this.capacity)];
    }

    return this.buffer[norm(this.readIndex + index, this.capacity)];
  }

  /**
   * Returns array of inserted items
   */
  toArray() {
    const arr: T[] = [];
    for (let i = 0; i < this.capacity; i++) {
      const element = this.peek(i);
      if (element !== undefined) {
        arr.push(element);
      }
    }

    return arr;
  }

  /**
   * Returns buffers capacity ( size )
   */
  getCapacity() {
    return this.capacity;
  }
}

//** returns index that is in [0, capacity) */
function norm(index: number, capacity: number) {
  index = index % capacity;

  // allow negative indexing
  if (index < 0) {
    index = capacity + index;
  }

  return index;
}
