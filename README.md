# circular_buffer

TypeScript/JavaScript implementation of a circular buffer, circular queue, cyclic buffer or ring buffer. A data structure that uses a single, fixed-size buffer as if it were connected end-to-end. This structure lends itself easily to buffering data streams  [Wikipedia](https://en.wikipedia.org/wiki/Circular_buffer). 

## Available methods


```typescript
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
  constructor(capacity: number, dontAdjustReadOnOverflow = false);

  /**
   * Adds new item to the end of buffer. Writing more items can "overflow" buffer
   * @param item - new item to insert
   */
  push(item: T);

  /**
   * Returns (and removes from buffer) last inserted item
   */
  pop();

  /**
   * Returns (and removes from buffer) first inserted item
   */
  shift();

  /**
   * Returns item by index, but doesn't remove it from buffer
   *  If       no index is passed             - return last pushed item
   *  If negative index is passed             - return from the end ( -1 would be same as no param )
   *  If positive ( or zero ) index is passed - return from the start
   */
  peek(index?: number);

  /**
   * Returns array of inserted items
   */
  toArray();

  /**
   * Returns buffers capacity ( size )
   */
  getCapacity();
```
