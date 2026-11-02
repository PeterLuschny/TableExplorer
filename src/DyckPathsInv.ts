/**
 * Provides the inverse of the DyckPaths triangle (unsigned version) as a Table.
 *
 * dyckpathsinv(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * T(n, k) = C(n+k, 2k)
 *
 * Triangle:
 * [0] [1]
 * [1] [1,  1]
 * [2] [1,  3,   1]
 * [3] [1,  6,   5,   1]
 * [4] [1, 10,  15,   7,  1]
 * [5] [1, 15,  35,  28,  9,  1]
 * [6] [1, 21,  70,  84, 45, 11,  1]
 *
 * References:
 *   OEIS: A085478, A129818, A123970
 *   Inverse: A039599
 */

import { Table } from './tabltypes';

const dyckPathsInvCache = new Map<number, bigint[]>();

export function dyckpathsinv(n: number): bigint[] {
    if (dyckPathsInvCache.has(n)) return dyckPathsInvCache.get(n)!;

    if (n === 0) { dyckPathsInvCache.set(0, [1n]); return [1n]; }
    if (n === 1) { dyckPathsInvCache.set(1, [1n, 1n]); return [1n, 1n]; }

    const q = [...dyckpathsinv(n - 2), 0n];  // row n-2, padded
    const p = [...dyckpathsinv(n - 1), 0n];  // row n-1, padded
    const row = [...p];
    row[n] = 1n;

    for (let k = n - 1; k >= 1; k--) {
        row[k] = p[k - 1] + 2n * p[k] - q[k];
    }

    dyckPathsInvCache.set(n, row);
    return row;
}

export const DyckPathsInv = new Table(
    dyckpathsinv,
    "DyckPathsInv",
    ["A085478", "A129818", "A123970"],
    "A039599",
    String.raw`\binom{n+k}{2k}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(DyckPathsInv));
}
