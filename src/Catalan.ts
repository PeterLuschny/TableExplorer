/**
 * Provides the Ballot Catalan triangle as a Table.
 *
 * catalan(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: T(n, k) = T(n-1, k-1) + 2*T(n-1, k) + T(n-1, k+1)
 * with T(n, 0) = 0 and T(n, n) = 1.
 *
 * Triangle:
 * [0] 1;
 * [1] 0,    1;
 * [2] 0,    2,    1;
 * [3] 0,    5,    4,    1;
 * [4] 0,   14,   14,    6,    1;
 * [5] 0,   42,   48,   27,    8,    1;
 * [6] 0,  132,  165,  110,   44,   10,   1;
 * [7] 0,  429,  572,  429,  208,   65,  12,   1;
 * [8] 0, 1430, 2002, 1638,  910,  350,  90,  14,  1;
 * [9] 0, 4862, 7072, 6188, 3808, 1700, 544, 119, 16, 1;
 *
 * References:
 *   OEIS: A128899, A039598
 *   Inverse: A128908
 */

import { Table } from './tabltypes';

const catalanCache = new Map<number, bigint[]>();

function catalan(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];

    const cached = catalanCache.get(n);
    if (cached !== undefined) return cached;

    const prev = [...catalan(n - 1), 0n];
    const middle = Array.from({ length: n - 1 }, (_, i) =>
        prev[i] + 2n * prev[i + 1] + prev[i + 2]
    );
    const result = [0n, ...middle, 1n];

    catalanCache.set(n, result);
    return result;
}

export const Catalan = new Table(
    catalan,
    "Catalan",
    ["A128899", "A039598"],
    "A128908",
    String.raw`\sum_{i=1}^{n-k+1} \text{Catalan}(i) T_{k-1, n-i}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Catalan));
}
