/**
 * Provides the Narayana triangle as a Table.
 *
 * narayana(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: start with [...prev, 1], then backward loop:
 *   T(n, k) += (2n - k) * T(n, k-1) / k  for k = n-1..1
 *
 * Triangle:
 * [0]  1;
 * [1]  0,  1;
 * [2]  0,  1,   1;
 * [3]  0,  1,   3,    1;
 * [4]  0,  1,   6,    6,     1;
 * [5]  0,  1,  10,   20,    10,     1;
 * [6]  0,  1,  15,   50,    50,    15,     1;
 * [7]  0,  1,  21,  105,   175,   105,    21,    1;
 * [8]  0,  1,  28,  196,   490,   490,   196,   28,   1;
 * [9]  0,  1,  36,  336,  1176,  1764,  1176,  336,  36,  1;
 *
 * References:
 *   OEIS: A090181, A001263, A131198
 *   Inverse: A103364
 */

import { Table } from './tabltypes';

const narayanaCache = new Map<number, bigint[]>();

export function narayana(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];

    const cached = narayanaCache.get(n);
    if (cached !== undefined) return cached;

    const row = [...narayana(n - 1), 1n];
    for (let k = n - 1; k >= 1; k--) {
        row[k] += BigInt(2 * n - k) * row[k - 1] / BigInt(k);
    }

    narayanaCache.set(n, row);
    return row;
}

export const Narayana = new Table(
    narayana,
    "Narayana",
    ["A090181", "A001263", "A131198"],
    "A103364",
    String.raw`\binom{n}{n-k} \binom{n-1}{n-k} \frac{1}{n-k+1}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Narayana));
}

