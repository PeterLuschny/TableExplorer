/**
 * Provides the DyckPaths triangle as a Table.
 *
 * dyckpaths(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: T(n, k) = T(n-1, k-1) + 2*T(n-1, k) + T(n-1, k+1)
 * with T(n, 0) = T(n-1, 0) + T(n-1, 1) and T(n, n) = 1.
 *
 * Triangle:
 * [0]    1;
 * [1]    1,     1;
 * [2]    2,     3,     1;
 * [3]    5,     9,     5,    1;
 * [4]   14,    28,    20,    7,    1;
 * [5]   42,    90,    75,   35,    9,    1;
 * [6]  132,   297,   275,  154,   54,   11,   1;
 * [7]  429,  1001,  1001,  637,  273,   77,  13,   1;
 * [8] 1430,  3432,  3640, 2548, 1260,  440, 104,  15,  1;
 * [9] 4862, 11934, 13260, 9996, 5508, 2244, 663, 135, 17, 1;
 *
 * References:
 *   OEIS: A039599, A050155
 */

import { Table } from './tabltypes';

const dyckPathsCache = new Map<number, bigint[]>();

function dyckpaths(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = dyckPathsCache.get(n);
    if (cached !== undefined) return cached;

    const prev = [...dyckpaths(n - 1), 0n];
    const middle = Array.from({ length: n - 1 }, (_, i) =>
        prev[i] + 2n * prev[i + 1] + prev[i + 2]
    );
    const result = [prev[0] + prev[1], ...middle, 1n];

    dyckPathsCache.set(n, result);
    return result;
}

export const DyckPaths = new Table(
    dyckpaths,
    "DyckPaths",
    ["A039599", "A050155"],
    "A000000",
    String.raw`\binom{2n}{n - k} (2k + 1) / (n + k + 1)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(DyckPaths));
}
