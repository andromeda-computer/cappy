export function parseRange(range?: string): [number, number] {
  if (!range) {
    return [0, Infinity];
  }

  const parts = range.split("=").at(-1)?.split("-") ?? [];
  const [startStr, endStr] = parts;

  const start = Number(startStr) || 0;
  const end = endStr ? Number(endStr) : Infinity;

  return [start, end];
}
