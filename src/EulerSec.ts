/**
 * Provides the Euler secant polynomial triangle as a Table.
 *
 * eulersec(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * row[0] = 0 (fill in below if n is even)
 * row[k] = binomial(n)[k] * eulersec(n-k)[0]  for k = 1..n
 * if n is even: row[0] = -sum(row[2], row[4], ...)
 *
 * Triangle:
 * [0] [   1]
 * [1] [   0,     1]
 * [2] [  -1,     0,     1]
 * [3] [   0,    -3,     0,   1]
 * [4] [   5,     0,    -6,   0,   1]
 * [5] [   0,    25,     0, -10,   0,   1]
 * [6] [ -61,     0,    75,   0, -15,   0,   1]
 * [7] [   0,  -427,     0, 175,   0, -21,   0,  1]
 * [8] [1385,     0, -1708,   0, 350,   0, -28,  0,  1]
 *
 * References:
 *   OEIS: A119879, A081658, A153641
 */

import { Table } from './tabltypes';
import { binomial } from './Binomial';

const eulerSecCache = new Map<number, bigint[]>();

export function eulersec(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = eulerSecCache.get(n);
    if (cached !== undefined) return cached;

    const b = binomial(n);
    const row = new Array<bigint>(n + 1).fill(0n);
    for (let k = 1; k <= n; k++) {
        row[k] = b[k] * eulersec(n - k)[0];
    }
    if (n % 2 === 0) {
        let s = 0n;
        for (let k = 2; k <= n; k += 2) s += row[k];
        row[0] = -s;
    }

    eulerSecCache.set(n, row);
    return row;
}

export const EulerSec = new Table(
    eulersec,
    "EulerSec",
    ["A119879", "A081658", "A153641"],
    "A000000",
    String.raw`\binom{n}{k}\, 2^{n-k}\ \text{Euler} (n-k, 1/2)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(EulerSec));
}

