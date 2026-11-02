/**
 * Provides the Schroeder triangle as a Table.
 *
 * schroeder(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: start with [...prev, 1], then backward loop:
 *   T(n, k) += T(n, k-1) + T(n, k+1)  for k = n-1..1
 * (k+1 is already updated; k-1 is still from the previous row)
 *
 * Triangle:
 * [0] [1]
 * [1] [0,     1]
 * [2] [0,     2,     1]
 * [3] [0,     6,     4,     1]
 * [4] [0,    22,    16,     6,    1]
 * [5] [0,    90,    68,    30,    8,    1]
 * [6] [0,   394,   304,   146,   48,   10,   1]
 * [7] [0,  1806,  1412,   714,  264,   70,  12,   1]
 * [8] [0,  8558,  6752,  3534, 1408,  430,  96,  14,  1]
 * [9] [0, 41586, 33028, 17718, 7432, 2490, 652, 126, 16, 1]
 *
 * References:
 *   OEIS: A122538, A033877, A080245, A080247, A106579
 *   Inverse: A122542
 */

import { Table } from './tabltypes';

const schroederCache = new Map<number, bigint[]>();

export function schroeder(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];

    const cached = schroederCache.get(n);
    if (cached !== undefined) return cached;

    const row = [...schroeder(n - 1), 1n];
    for (let k = n - 1; k >= 1; k--) {
        row[k] += row[k - 1] + row[k + 1];
    }

    schroederCache.set(n, row);
    return row;
}

export const Schroeder = new Table(
    schroeder,
    "Schroeder",
    ["A122538", "A033877", "A080245", "A080247", "A106579"],
    "A122542",
    String.raw`\text{is}(k=0)\,?\,0^{n} : T(n-1,k-1)+T(n-1,k)+T(n,k+1)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Schroeder));
}

