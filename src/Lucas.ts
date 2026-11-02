/**
 * Provides the Lucas triangle as a Table.
 *
 * lucas(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * T(n, k) = C(n, k) + C(n-1, k-1)
 *
 * Triangle:
 * [0] [2]
 * [1] [1,  2]
 * [2] [1,  3,   2]
 * [3] [1,  4,   5,   2]
 * [4] [1,  5,   9,   7,   2]
 * [5] [1,  6,  14,  16,   9,   2]
 * [6] [1,  7,  20,  30,  25,  11,   2]
 * [7] [1,  8,  27,  50,  55,  36,  13,   2]
 * [8] [1,  9,  35,  77, 105,  91,  49,  15,  2]
 * [9] [1, 10,  44, 112, 182, 196, 140,  64, 17,  2]
 *
 * References:
 *   OEIS: A029635, A029653
 */

import { Table } from './tabltypes';

const lucasCache = new Map<number, bigint[]>();

export function lucas(n: number): bigint[] {
    if (lucasCache.has(n)) return lucasCache.get(n)!;

    if (n === 0) { lucasCache.set(0, [2n]); return [2n]; }
    if (n === 1) { lucasCache.set(1, [1n, 2n]); return [1n, 2n]; }

    const row = [...lucas(n - 1), 0n];  // copy previous row and append 0
    for (let k = n; k >= 1; k--) {
        row[k] += row[k - 1];
    }

    lucasCache.set(n, row);
    return row;
}

export const Lucas = new Table(
    lucas,
    "Lucas",
    ["A029635", "A029653"],
    "",
    String.raw`\binom{n}{k} + \binom{n-1}{k-1}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Lucas));
}
