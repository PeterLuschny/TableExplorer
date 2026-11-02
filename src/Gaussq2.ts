/**
 * Provides the Gaussian binomial coefficient triangle for q = 2 as a Table.
 *
 * gaussq2(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: row = [1, ...gaussq2(n-1)],
 *   row[k] = prev[k-1] + p * prev[k]  for k = 1..n-1
 *   (p doubles each iteration starting at 2)
 *
 * Triangle:
 * [0]  1;
 * [1]  1,   1;
 * [2]  1,   3,    1;
 * [3]  1,   7,    7,     1;
 * [4]  1,  15,   35,    15,     1;
 * [5]  1,  31,  155,   155,    31,    1;
 * [6]  1,  63,  651,  1395,   651,   63,   1;
 * [7]  1, 127, 2667, 11811, 11811, 2667, 127, 1;
 *
 * References:
 *   OEIS: A022166
 */

import { Table } from './tabltypes';

const gaussq2Cache = new Map<number, bigint[]>();

export function gaussq2(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = gaussq2Cache.get(n);
    if (cached !== undefined) return cached;

    const prev = gaussq2(n - 1);
    const row = [1n, ...prev];
    let p = 2n;
    for (let k = 1; k < n; k++) {
        row[k] = prev[k - 1] + p * prev[k];
        p *= 2n;
    }

    gaussq2Cache.set(n, row);
    return row;
}

export const Gaussq2 = new Table(
    gaussq2,
    "Gaussq2",
    ["A022166"],
    "A000000",
    String.raw`\prod_{i=k+1}^{n} (2^i - 1) \ / \ \prod_{i=1}^{n-k} (2^i - 1)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Gaussq2));
}

