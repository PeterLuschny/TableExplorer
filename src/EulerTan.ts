/**
 * Provides the Euler tangent polynomial triangle as a Table.
 *
 * eulertan(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * row[0] = 0 (fill in below if n is odd)
 * row[k] = binomial(n)[k] * eulertan(n-k)[0]  for k = 1..n
 * if n is odd: row[0] = -sum(row[2], row[4], ...) + 1
 *
 * Triangle:
 * [0]    0;
 * [1]    1,     0;
 * [2]    0,     2,     0;
 * [3]   -2,     0,     3,   0;
 * [4]    0,    -8,     0,   4,    0;
 * [5]   16,     0,   -20,   0,    5,    0;
 * [6]    0,    96,     0, -40,    0,    6,    0;
 * [7] -272,     0,   336,   0,  -70,    0,    7,  0;
 * [8]    0, -2176,     0, 896,    0, -112,    0,  8,  0;
 * [9] 7936,     0, -9792,   0, 2016,    0, -168,  0,  9,  0;
 *
 * References:
 *   OEIS: A162660, A350972, A155585, A009006, A000182
 */

import { Table } from './tabltypes';
import { binomial } from './Binomial';

const eulerTanCache = new Map<number, bigint[]>();

export function eulertan(n: number): bigint[] {
    const cached = eulerTanCache.get(n);
    if (cached !== undefined) return cached;

    const b = binomial(n);
    const row = new Array<bigint>(n + 1).fill(0n);
    for (let k = 1; k <= n; k++) {
        row[k] = b[k] * eulertan(n - k)[0];
    }
    if (n % 2 === 1) {
        let s = 0n;
        for (let k = 2; k <= n; k += 2) s += row[k];
        row[0] = -s + 1n;
    }

    eulerTanCache.set(n, row);
    return row;
}

export const EulerTan = new Table(
    eulertan,
    "EulerTan",
    ["A162660", "A350972", "A155585", "A009006", "A000182"],
    "",
    String.raw`[x^k]( -x^n + \sum_{k=0}^{n} \binom{n}{k} \text{Euler}(k) (x+1)^{n - k})`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(EulerTan));
}

