/**
 * Provides Euler's partition triangle as a Table.
 *
 * partition(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * T(n, k) = number of partitions of n into exactly k parts.
 * Recurrence: T(n, k) = T(n-1, k-1) + T(n-k, k)
 *
 * Triangle:
 * [0] [1]
 * [1] [0, 1]
 * [2] [0, 1, 1]
 * [3] [0, 1, 1, 1]
 * [4] [0, 1, 2, 1, 1]
 * [5] [0, 1, 2, 2, 1, 1]
 * [6] [0, 1, 3, 3, 2, 1, 1]
 * [7] [0, 1, 3, 4, 3, 2, 1, 1]
 * [8] [0, 1, 4, 5, 5, 3, 2, 1, 1]
 * [9] [0, 1, 4, 7, 6, 5, 3, 2, 1, 1]
 *
 * References:
 *   OEIS: A072233, A008284, A058398
 *   See also: A026820, A000041
 */

import { Table } from './tabltypes';

// 2D cache keyed by n, then k
const partCache = new Map<number, Map<number, bigint>>();

function part(n: number, k: number): bigint {
    if (k < 0 || n < 0) return 0n;
    if (k === 0) return n === 0 ? 1n : 0n;

    const row = partCache.get(n);
    if (row !== undefined) {
        const cached = row.get(k);
        if (cached !== undefined) return cached;
    }

    const result = part(n - 1, k - 1) + part(n - k, k);

    if (!partCache.has(n)) partCache.set(n, new Map());
    partCache.get(n)!.set(k, result);
    return result;
}

function partition(n: number): bigint[] {
    return Array.from({ length: n + 1 }, (_, k) => part(n, k));
}

export const Partition = new Table(
    partition,
    "Partition",
    ["A072233", "A008284", "A058398"],
    "A000000",
    String.raw`T_{n - 1, k - 1} + T_{n - k, k}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Partition));
}
