/**
 * Provides the expansion of x^n in terms of Laguerre (unsigned) as a Table.
 *
 * powlaguerre(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: row = [...powlaguerre(n-1), 1], then
 *   row[0] = row[n] = row[0] * n
 *   row[k] = ((n - k + 1) * row[k-1]) / k  for k = 1..n-1
 *
 * Triangle:
 * [0] [   1]
 * [1] [   1,     1]
 * [2] [   2,     4,      2]
 * [3] [   6,    18,     18,      6]
 * [4] [  24,    96,    144,     96,     24]
 * [5] [ 120,   600,   1200,   1200,    600,    120]
 * [6] [ 720,  4320,  10800,  14400,  10800,   4320,   720]
 * [7] [5040, 35280, 105840, 176400, 176400, 105840, 35280, 5040]
 *
 * References:
 *   OEIS: A196347, A021012
 */

import { Table } from './tabltypes';

const powlaguerreCache = new Map<number, bigint[]>();

export function powlaguerre(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = powlaguerreCache.get(n);
    if (cached !== undefined) return cached;

    const row = [...powlaguerre(n - 1), 1n];
    const val = row[0] * BigInt(n);
    row[0] = val;
    row[n] = val;
    for (let k = 1; k < n; k++) {
        row[k] = (BigInt(n - k + 1) * row[k - 1]) / BigInt(k);
    }

    powlaguerreCache.set(n, row);
    return row;
}

export const PowLaguerre = new Table(
    powlaguerre,
    "PowLaguerre",
    ["A196347", "A021012"],
    "",
    String.raw`n! \binom{n}{k}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(PowLaguerre));
}
