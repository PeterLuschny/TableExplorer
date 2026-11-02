/**
 * Provides Leibniz's Triangle as a Table.
 *
 * leibniz(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * T(n, k) = FallingFactorial(n + 1, n) / (k! * (n - k)!)
 *         = (k + 1) * C(n + 1, k + 1)
 *
 * Triangle:
 * [0]  1
 * [1]  2   2
 * [2]  3   6    3
 * [3]  4  12   12    4
 * [4]  5  20   30   20    5
 * [5]  6  30   60   60   30    6
 * [6]  7  42  105  140  105   42    7
 * [7]  8  56  168  280  280  168   56    8
 * [8]  9  72  252  504  630  504  252   72   9
 * [9] 10  90  360  840 1260 1260  840  360  90  10
 *
 * References:
 *   OEIS: A003506
 */

import { Table } from './tabltypes';

const leibnizCache = new Map<number, bigint[]>();

export function leibniz(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = leibnizCache.get(n);
    if (cached !== undefined) return cached;

    const row = new Array<bigint>(n + 1).fill(0n);
    row[0] = row[n] = BigInt(n + 1);
    for (let k = 1; k < n; k++) {
        row[k] = (BigInt(n - k + 1) * row[k - 1]) / BigInt(k);
    }

    leibnizCache.set(n, row);
    return row;
}

export const Leibniz = new Table(
    leibniz,
    "Leibniz",
    ["A003506"],
    "",
    String.raw`(k+1) \, \binom{n+1}{k+1}`,
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Leibniz));
}
