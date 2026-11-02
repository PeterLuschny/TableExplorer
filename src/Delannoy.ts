/**
 * Provides the Delannoy triangle as a Table.
 *
 * delannoy(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: middle[i] = prev1[i+1] + prev1[i] + prev2[i],
 *   row = [1, ...middle, 1]
 *
 * Triangle:
 * [0] [1]
 * [1] [1,  1]
 * [2] [1,  3,   1]
 * [3] [1,  5,   5,   1]
 * [4] [1,  7,  13,   7,   1]
 * [5] [1,  9,  25,  25,   9,   1]
 * [6] [1, 11,  41,  63,  41,  11,   1]
 * [7] [1, 13,  61, 129, 129,  61,  13,   1]
 * [8] [1, 15,  85, 231, 321, 231,  85,  15,  1]
 * [9] [1, 17, 113, 377, 681, 681, 377, 113, 17, 1]
 *
 * References:
 *   OEIS: A008288
 *   Inverse: A132372
 */

import { Table } from './tabltypes';

const delannoyCache = new Map<number, bigint[]>();

export function delannoy(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [1n, 1n];

    const cached = delannoyCache.get(n);
    if (cached !== undefined) return cached;

    const prev1 = delannoy(n - 1);
    const prev2 = delannoy(n - 2);
    const middle = prev2.map((c, i) => prev1[i + 1] + prev1[i] + c);
    const result = [1n, ...middle, 1n];

    delannoyCache.set(n, result);
    return result;
}

export const Delannoy = new Table(
    delannoy,
    "Delannoy",
    ["A008288"],
    "A132372",
    String.raw`\text{Hyper}([-k, k - n], [1], 2)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Delannoy));
}
