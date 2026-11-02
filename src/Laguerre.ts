/**
 * Provides the Laguerre polynomials triangle (unsigned, n! * L(n,x)) as a Table.
 *
 * laguerre(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: start with [0, ...prev], then
 *   T(n, k) += (n+k) * T(n, k+1)  for k = 0..n-1
 *
 * Triangle:
 * [0]      1
 * [1]      1,       1
 * [2]      2,       4,       1
 * [3]      6,      18,       9,       1
 * [4]     24,      96,      72,      16,       1
 * [5]    120,     600,     600,     200,      25,      1
 * [6]    720,    4320,    5400,    2400,     450,     36,     1
 * [7]   5040,   35280,   52920,   29400,    7350,    882,    49,    1
 * [8]  40320,  322560,  564480,  376320,  117600,  18816,  1568,   64,  1
 *
 * References:
 *   OEIS: A021009, A021010, A144084
 */

import { Table } from './tabltypes';

const laguerreCache = new Map<number, bigint[]>();

export function laguerre(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = laguerreCache.get(n);
    if (cached !== undefined) return cached;

    const row = [0n, ...laguerre(n - 1)];
    for (let k = 0; k < n; k++) {
        row[k] += BigInt(n + k) * row[k + 1];
    }

    laguerreCache.set(n, row);
    return row;
}

export const Laguerre = new Table(
    laguerre,
    "Laguerre",
    ["A021009", "A021010", "A144084"],
    "A000000",
    String.raw`\binom{n}{k}\, \frac{n!}{k!}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Laguerre));
}
