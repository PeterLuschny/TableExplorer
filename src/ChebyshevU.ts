/**
 * Provides the Chebyshev U(n, x) polynomial coefficients as a Table.
 *
 * chebyshevu(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: row = [0, ...chebyshevu(n-1)], then
 *   row[n]  = 2 * row[n]
 *   row[k] = 2 * row[k] - chebyshevu(n-2)[k]  for k = 0..n-2
 *
 * Triangle (signed):
 * [0]  1;
 * [1]  0,  2;
 * [2] -1,  0,   4;
 * [3]  0, -4,   0,    8;
 * [4]  1,  0, -12,    0,  16;
 * [5]  0,  6,   0,  -32,   0,   32;
 * [6] -1,  0,  24,    0, -80,    0,   64;
 * [7]  0, -8,   0,   80,   0, -192,    0,   128;
 * [8]  1,  0, -40,    0, 240,    0, -448,     0, 256;
 * [9]  0, 10,   0, -160,   0,  672,    0, -1024,   0,  512;
 *
 * References:
 *   OEIS: A053117, A053118, A115322
 */

import { Table } from './tabltypes';

const chebyshevUCache = new Map<number, bigint[]>();

export function chebyshevu(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 2n];

    const cached = chebyshevUCache.get(n);
    if (cached !== undefined) return cached;

    const rov = chebyshevu(n - 2);
    const row = [0n, ...chebyshevu(n - 1)];
    row[n] = 2n * row[n];
    for (let k = 0; k < n - 1; k++) {
        row[k] = 2n * row[k] - rov[k];
    }

    chebyshevUCache.set(n, row);
    return row;
}

export const ChebyshevU = new Table(
    chebyshevu,
    "ChebyshevU",
    ["A053117", "A053118", "A115322"],
    "",
    String.raw`2^k \binom{(n+k)/2}{k} \text{A369736}(n, k)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(ChebyshevU));
}

