/**
 * Provides the Bessel triangle as a Table.
 *
 * bessel(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: start with [...prev, 1], then backward loop:
 *   T(n, k) = T(n-1, k-1) + (2(n-1) - k) * T(n-1, k)  for k = n-1..1
 *
 * Triangle:
 * [0] [1]
 * [1] [0,      1]
 * [2] [0,      1,      1]
 * [3] [0,      3,      3,     1]
 * [4] [0,     15,     15,     6,     1]
 * [5] [0,    105,    105,    45,    10,    1]
 * [6] [0,    945,    945,   420,   105,   15,   1]
 * [7] [0,  10395,  10395,  4725,  1260,  210,  21,  1]
 * [8] [0, 135135, 135135, 62370, 17325, 3150, 378, 28, 1]
 *
 * References:
 *   OEIS: A132062, A001497, A001498, A122850
 *   Inverse: A122848
 */

import { Table } from './tabltypes';

const besselCache = new Map<number, bigint[]>();

export function bessel(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];

    const cached = besselCache.get(n);
    if (cached !== undefined) return cached;

    const row = [...bessel(n - 1), 1n];
    for (let k = n - 1; k >= 1; k--) {
        row[k] = row[k - 1] + BigInt(2 * (n - 1) - k) * row[k];
    }

    besselCache.set(n, row);
    return row;
}

export const Bessel = new Table(
    bessel,
    "Bessel",
    ["A132062", "A001497", "A001498", "A122850"],
    "A122848",
    String.raw`2^{k - n} \binom{2n - 2k}{n - k} \binom{2n - k - 1}{k - 1} (n - k)!`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Bessel));
}

