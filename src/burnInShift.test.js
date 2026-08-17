import { describe, expect, it } from 'vitest';
import { getBurnInShiftOffset } from './burnInShift.js';

describe('getBurnInShiftOffset', () => {
  it('cycles the clock position once per minute', () => {
    const first = getBurnInShiftOffset(new Date(0));
    const second = getBurnInShiftOffset(new Date(60_000));
    const repeated = getBurnInShiftOffset(new Date(8 * 60_000));

    expect(second).not.toEqual(first);
    expect(repeated).toEqual(first);
  });
});
