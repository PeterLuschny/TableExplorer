/**
 * Provides cardinalities of finite distributive lattices as a Table.
 *
 * updownwords(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 * [0] 1;
 * [1] 1,  1;
 * [2] 1,  2,  1;
 * [3] 1,  3,  3,  1;
 * [4] 1,  5,  6,  4,  1;
 * [5] 1,  8, 14, 10,  5, 1;
 * [6] 1, 13, 31, 30, 15, 6, 1;
 * [7] 1, 21, 70, 85, 55, 21, 7, 1;
 *
 * References:
 *   OEIS: A050446, A050447
 */

import { Table } from './tabltypes';

const updownwordsCache = new Map<number, bigint[]>();

export function updownwords(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = updownwordsCache.get(n);
    if (cached !== undefined) return cached;

    const row = new Array<bigint>(n + 1).fill(1n);
    for (let k = 1; k < n; k++) {
        const a = Math.floor((n - k - 1) / 2) + 1;
        const prev = updownwords(n - 1)[k - 1];
        let s = 0n;
        for (let j = 0; j < a; j++) {
            s += updownwords(2 * j + k - 1)[k - 1] * updownwords(n - 1 - 2 * j)[k];
        }
        row[k] = prev + s;
    }

    updownwordsCache.set(n, row);
    return row;
}

export const UpDownWords = new Table(
    updownwords,
    "UpDownWords",
    ["A050446", "A050447"],
    "A000000",
    String.raw``
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(UpDownWords));
}

