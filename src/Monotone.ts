/**
 * Provides the Monotone words triangle as a Table.
 *
 * monotone(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Formula: T(n, k) = binomial(n+k-1, k) = C(-n, k) * (-1)^k
 * Recurrence: T(n, k+1) = T(n, k) * (n+k) / (k+1)
 *
 * Triangle:
 * [0] [1]
 * [1] [1, 1]
 * [2] [1, 2,  3]
 * [3] [1, 3,  6,  10]
 * [4] [1, 4, 10,  20,  35]
 * [5] [1, 5, 15,  35,  70,  126]
 * [6] [1, 6, 21,  56, 126,  252,  462]
 * [7] [1, 7, 28,  84, 210,  462,  924, 1716]
 * [8] [1, 8, 36, 120, 330,  792, 1716, 3432,  6435]
 * [9] [1, 9, 45, 165, 495, 1287, 3003, 6435, 12870, 24310]
 *
 * References:
 *   OEIS: A059481, A027555
 */

import { Table } from './tabltypes';

const monotoneCache = new Map<number, bigint[]>();

export function monotone(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = monotoneCache.get(n);
    if (cached !== undefined) return cached;

    const row = Array(n + 1).fill(1n) as bigint[];
    row[1] = BigInt(n);
    for (let k = 1; k < n; k++) {
        row[k + 1] = row[k] * BigInt(n + k) / BigInt(k + 1);
    }

    monotoneCache.set(n, row);
    return row;
}

export const Monotone = new Table(
    monotone,
    "Monotone",
    ["A059481", "A027555"],
    "",
    String.raw`\binom{n+k-1}{k}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Monotone));
}
