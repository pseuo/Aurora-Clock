const shiftOffsets = [
  { x: -12, y: -8 },
  { x: 0, y: -12 },
  { x: 12, y: -8 },
  { x: 12, y: 8 },
  { x: 0, y: 12 },
  { x: -12, y: 8 },
  { x: -6, y: 0 },
  { x: 6, y: 0 },
];

export function getBurnInShiftOffset(date) {
  const minute = Math.floor(date.getTime() / 60_000);
  return shiftOffsets[minute % shiftOffsets.length];
}
