/**
 * Provides the Eulerian triangle as a Table.
 *
 * eulerian(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: T(n, k) = (n-k+1) * T(n-1, k-1) + k * T(n-1, k)
 * (loop runs backward to avoid overwriting needed values)
 *
 * Triangle:
 * [0]  1
 * [1]  0  1
 * [2]  0  1    1
 * [3]  0  1    4     1
 * [4]  0  1   11    11      1
 * [5]  0  1   26    66     26       1
 * [6]  0  1   57   302    302      57       1
 * [7]  0  1  120  1191   2416    1191     120      1
 *
 * References:
 *   OEIS: A173018, A123125, A008292
 *   Inverse: A055325
 */

import { Table } from './tabltypes';

const eulerianCache = new Map<number, bigint[]>();

function eulerian(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];

    const cached = eulerianCache.get(n);
    if (cached !== undefined) return cached;

    const row = [...eulerian(n - 1), 1n];
    for (let k = n - 1; k >= 1; k--) {
        row[k] = BigInt(n - k + 1) * row[k - 1] + BigInt(k) * row[k];
    }

    eulerianCache.set(n, row);
    return row;
}

export const Eulerian = new Table(
    eulerian,
    "Eulerian",
    ["A173018", "A123125", "A008292"],
    "A055325",
    String.raw`\sum_{j=0}^{k} (-1)^{j} \binom{n+1}{j} (k+1-j)^{n}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Eulerian));
}
