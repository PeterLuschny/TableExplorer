/**
 * Provides the Bell (Peirce/Aitken) triangle as a Table.
 * See also A182930.
 *
 * bell(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   [0]     1;
 *   [1]     1,     2;
 *   [2]     2,     3,     5;
 *   [3]     5,     7,    10,    15;
 *   [4]    15,    20,    27,    37,    52;
 *   [5]    52,    67,    87,   114,   151,   203;
 *   [6]   203,   255,   322,   409,   523,   674,   877;
 *   [7]   877,  1080,  1335,  1657,  2066,  2589,  3263,  4140;
 *   [8]  4140,  5017,  6097,  7432,  9089, 11155, 13744, 17007, 21147;
 *   [9] 21147, 25287, 30304, 36401, 43833, 52922, 64077, 77821, 94828, 115975;
 *
 * References:
 *   OEIS: A011971, A011972, A123346
 */

import { Table } from './tabltypes';

const bellCache = new Map<number, bigint[]>();

export function bell(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = bellCache.get(n);
    if (cached !== undefined) return cached;

    const prev = bell(n - 1);
    const row = [prev[n - 1], ...prev];
    for (let k = 1; k <= n; k++) {
        row[k] += row[k - 1];
    }

    bellCache.set(n, row);
    return row;
}

export const Bell = new Table(
    bell,
    "Bell",
    ["A011971", "A011972", "A123346"],
    "A000000",
    String.raw`\sum_{j=0}^{k} \binom{k}{j} Bell(n - k + j)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Bell));
}

