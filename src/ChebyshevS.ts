/**
 * Provides the Chebyshev S(n, x) = U(n, x/2) polynomial coefficients as a Table.
 *
 * chebyshevs(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: row = [0, ...chebyshevs(n-1)], then
 *   row[k] -= chebyshevs(n-2)[k]  for k = 0..n-2
 *
 * Triangle (signed):
 * [0]  1;
 * [1]  0,  1;
 * [2] -1,  0,   1;
 * [3]  0, -2,   0,   1;
 * [4]  1,  0,  -3,   0,  1;
 * [5]  0,  3,   0,  -4,  0,  1;
 * [6] -1,  0,   6,   0, -5,  0,  1;
 * [7]  0, -4,   0,  10,  0, -6,  0,   1;
 * [8]  1,  0, -10,   0, 15,  0, -7,   0, 1;
 * [9]  0,  5,   0, -20,  0,  21,  0, -8, 0, 1;
 *
 * References:
 *   OEIS: A049310, A053119, A112552, A168561
 *   Inverse: A053121 (Catalan Paths triangle)
 */

import { Table } from './tabltypes';

const chebyshevSCache = new Map<number, bigint[]>();

function chebyshevs(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];

    const cached = chebyshevSCache.get(n);
    if (cached !== undefined) return cached;

    const rov = chebyshevs(n - 2);
    const row = [0n, ...chebyshevs(n - 1)];
    for (let k = 0; k < n - 1; k++) {
        row[k] -= rov[k];
    }

    chebyshevSCache.set(n, row);
    return row;
}

export const ChebyshevS = new Table(
    chebyshevs,
    "ChebyshevS",
    ["A049310", "A053119", "A112552", "A168561"],
    "A053121",
    String.raw`\binom{(n+k)/2}{k} \text{A369736}(n, k)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(ChebyshevS));
}
