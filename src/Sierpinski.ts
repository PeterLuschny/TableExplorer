/**
 * Provides Sierpiński's triangle, binomial(n, k) mod 2, as a Table.
 *
 * sierpinski(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * T(n, k) = 1 if (~n & k) === 0, i.e. all bits of k are set in n (Lucas mod 2).
 *
 * Triangle:
 * [0]                               1
 * [1]                              1, 1
 * [2]                            1, 0, 1
 * [3]                           1, 1, 1, 1
 * [4]                         1, 0, 0, 0, 1
 * [5]                        1, 1, 0, 0, 1, 1
 * [6]                      1, 0, 1, 0, 1, 0, 1
 * [7]                     1, 1, 1, 1, 1, 1, 1, 1
 * [8]                   1, 0, 0, 0, 0, 0, 0, 0, 1
 * [9]                  1, 1, 0, 0, 0, 0, 0, 0, 1, 1
 *
 * References:
 *   OEIS: A047999, A090971, A114700, A143200, A166282
 */

import { Table } from './tabltypes';

export function sierpinski(n: number): bigint[] {
    return Array.from({ length: n + 1 }, (_, k) => (~n & k) === 0 ? 1n : 0n);
}

export const Sierpinski = new Table(
    sierpinski,
    "Sierpinski",
    ["A047999", "A090971", "A114700", "A143200", "A166282"],
    "A000000",
    String.raw`\binom{n}{k} \text{ mod } 2`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Sierpinski));
}
