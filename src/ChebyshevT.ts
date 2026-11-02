/**
 * Provides the Chebyshev T(n, x) polynomial coefficients as a Table.
 *
 * chebyshevt(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Not integer-invertible, but the rational inverse
 * times 2^n is the right wing of Pascal's triangle.
 *
 * Recurrence: row = [0, ...chebyshevt(n-1)], then
 *   row[n]  = 2 * row[n]
 *   row[k] = 2 * row[k] - chebyshevt(n-2)[k]  for k = 0..n-2
 *
 * Triangle (signed):
 * [0]   1;
 * [1]   0,  1;
 * [2]  -1,  0,   2;
 * [3]   0, -3,   0,    4;
 * [4]   1,  0,  -8,    0,    8;
 * [5]   0,  5,   0,  -20,    0,    16;
 * [6]  -1,  0,  18,    0,  -48,     0,    32;
 * [7]   0, -7,   0,   56,    0,  -112,     0,   64;
 * [8]   1,  0, -32,    0,  160,     0,  -256,    0,  128;
 * [9]   0,  9,   0, -120,    0,   432,     0, -576,    0,  256;
 *
 * References:
 *   OEIS: A053120, A039991, A081265
 */

import { Table } from './tabltypes';

const chebyshevTCache = new Map<number, bigint[]>();

export function chebyshevt(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];

    const cached = chebyshevTCache.get(n);
    if (cached !== undefined) return cached;

    const rov = chebyshevt(n - 2);
    const row = [0n, ...chebyshevt(n - 1)];
    row[n] = 2n * row[n];
    for (let k = 0; k < n - 1; k++) {
        row[k] = 2n * row[k] - rov[k];
    }

    chebyshevTCache.set(n, row);
    return row;
}

export const ChebyshevT = new Table(
    chebyshevt,
    "ChebyshevT",
    ["A053120", "A039991", "A081265"],
    "",
    String.raw`%%`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(ChebyshevT));
}
