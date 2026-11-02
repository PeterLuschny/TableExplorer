/**
 * Provides the Fibonacci-Pascal triangle as a Table.
 *
 * fibonacci(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: row = [...fibonacci(n-1), 1], save row[1],
 *   then row[k] += row[k-1] for k = n-1 down to 1,
 *   finally row[0] = saved value.
 *
 * Triangle:
 * [0] [ 1]
 * [1] [ 0,  1]
 * [2] [ 1,  1,  1]
 * [3] [ 1,  2,  2,  1]
 * [4] [ 2,  3,  4,  3,  1]
 * [5] [ 3,  5,  7,  7,  4,  1]
 * [6] [ 5,  8, 12, 14, 11,  5,  1]
 * [7] [ 8, 13, 20, 26, 25, 16,  6,  1]
 * [8] [13, 21, 33, 46, 51, 41, 22,  7, 1]
 * [9] [21, 34, 54, 79, 97, 92, 63, 29, 8, 1]
 *
 * References:
 *   OEIS: A354267, A105809, A228074
 */

import { Table } from './tabltypes';

const fibonacciCache = new Map<number, bigint[]>();

export function fibonacci(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];

    const cached = fibonacciCache.get(n);
    if (cached !== undefined) return cached;

    const row = [...fibonacci(n - 1), 1n];
    const s = row[1];
    for (let k = n - 1; k > 0; k--) {
        row[k] += row[k - 1];
    }
    row[0] = s;

    fibonacciCache.set(n, row);
    return row;
}

export const Fibonacci = new Table(
    fibonacci,
    "Fibonacci",
    ["A354267", "A105809", "A228074"],
    "A000000",
    String.raw`T(n-1, k-1) + T(n-1, k)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Fibonacci));
}

