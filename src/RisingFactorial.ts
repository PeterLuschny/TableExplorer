/**
 * Provides the Rising factorial triangle as a Table.
 *
 * risingfactorial(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * row[0] = 1, row[1] = n,
 * row[k+1] = row[k] * (n + k)  for k = 1..n-1
 *
 * Triangle:
 * [0]  1;
 * [1]  1, 1;
 * [2]  1, 2,   6;
 * [3]  1, 3,  12,  60;
 * [4]  1, 4,  20, 120,  840;
 * [5]  1, 5,  30, 210, 1680, 15120;
 * [6]  1, 6,  42, 336, 3024, 30240, 332640;
 * [7]  1, 7,  56, 504, 5040, 55440, 665280, 8648640;
 *
 * References:
 *   OEIS: A124320
 */

import { Table } from './tabltypes';

const risingFactorialCache = new Map<number, bigint[]>();

export function risingfactorial(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = risingFactorialCache.get(n);
    if (cached !== undefined) return cached;

    const row = new Array<bigint>(n + 1).fill(1n);
    row[1] = BigInt(n);
    for (let k = 1; k < n; k++) {
        row[k + 1] = row[k] * BigInt(n + k);
    }

    risingFactorialCache.set(n, row);
    return row;
}

export const RisingFactorial = new Table(
    risingfactorial,
    "RisingFactorial",
    ["A124320"],
    "",
    String.raw`k! \binom{n+k-1}{k}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(RisingFactorial));
}

