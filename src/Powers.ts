/**
 * Provides the Powers triangle as a Table.
 *
 * powers(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Formula: T(n, k) = k^(n-k)
 * Recurrence: T(n, k) = k * T(n-1, k), with T(n, n) = 1.
 *
 * Triangle:
 * [0]  [1]
 * [1]  [0, 1]
 * [2]  [0, 1,   1]
 * [3]  [0, 1,   2,   1]
 * [4]  [0, 1,   4,   3,    1]
 * [5]  [0, 1,   8,   9,    4,   1]
 * [6]  [0, 1,  16,  27,   16,   5,   1]
 * [7]  [0, 1,  32,  81,   64,  25,   6,  1]
 * [8]  [0, 1,  64, 243,  256, 125,  36,  7, 1]
 * [9]  [0, 1, 128, 729, 1024, 625, 216, 49, 8, 1]
 *
 * References:
 *   OEIS: A004248, A009998, A051129
 */

import { Table } from './tabltypes';

const powersCache = new Map<number, bigint[]>();

export function powers(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = powersCache.get(n);
    if (cached !== undefined) return cached;

    const lrow = powers(n - 1);
    const result = [...Array.from({ length: n }, (_, k) => BigInt(k) * lrow[k]), 1n];

    powersCache.set(n, result);
    return result;
}

export const Powers = new Table(
    powers,
    "Powers",
    ["A004248", "A009998", "A051129"],
    "A000000",
    String.raw`k^{n - k}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Powers));
}
