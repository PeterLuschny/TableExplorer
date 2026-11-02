/**
 * Provides Ternary trees (Fuss-Catalan 2) as a Table.
 *
 * ternarytrees(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: row = [...ternarytrees(n-1), ternarytrees(n-1)[n-1]],
 *   then apply prefix sum twice (double accumulate).
 *
 * Triangle:
 * [0] [1]
 * [1] [0, 1]
 * [2] [0, 1,  3]
 * [3] [0, 1,  5, 12]
 * [4] [0, 1,  7, 25,  55]
 * [5] [0, 1,  9, 42, 130,  273]
 * [6] [0, 1, 11, 63, 245,  700, 1428]
 * [7] [0, 1, 13, 88, 408, 1428, 3876, 7752]
 *
 * References:
 *   OEIS: A355172
 */

import { Table } from './tabltypes';

const ternaryTreesCache = new Map<number, bigint[]>();

export function ternarytrees(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];

    const cached = ternaryTreesCache.get(n);
    if (cached !== undefined) return cached;

    const prev = ternarytrees(n - 1);
    const row = [...prev, prev[n - 1]];
    let s = 0n, a = 0n;
    for (let i = 0; i < row.length; i++) {
        s += row[i];
        a += s;
        row[i] = a;
    }

    ternaryTreesCache.set(n, row);
    return row;
}

export const TernaryTrees = new Table(
    ternarytrees,
    "TernaryTrees",
    ["A355172"],
    "",
    String.raw`is(k=0)\, ?\, 0^n : \frac{(2n-2k+3) \, (2n+k-1)!}{(2n+1)! \, (k-1)!}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(TernaryTrees));
}

