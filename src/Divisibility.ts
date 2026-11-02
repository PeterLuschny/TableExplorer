/**
 * Provides the Divisibility matrix as a Table.
 *
 * divisibility(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * T(n, k) = 1 if n = 0 or k divides n, else 0.
 * The matrix inverse of the Möbius matrix.
 *
 * Triangle:
 * [ 0]  1
 * [ 1]  0  1
 * [ 2]  0  1  1
 * [ 3]  0  1  0  1
 * [ 4]  0  1  1  0  1
 * [ 5]  0  1  0  0  0  1
 * [ 6]  0  1  1  1  0  0  1
 * [ 7]  0  1  0  0  0  0  0  1
 * [ 8]  0  1  1  0  1  0  0  0  1
 * [ 9]  0  1  0  1  0  0  0  0  0  1
 * [10]  0  1  1  0  0  1  0  0  0  0  1
 *
 * References:
 *   OEIS: A113704, A051731
 */

import { Table } from './tabltypes';

export function divisibility(n: number): bigint[] {
    if (n === 0) return [1n];

    const row = new Array<bigint>(n + 1).fill(0n);
    row[1] = row[n] = 1n;

    let i = 2;
    let div = n;
    while (i < div) {
        div = Math.floor(n / i);
        if (n % i === 0) {
            row[i] = 1n;
            row[div] = 1n;
        }
        i++;
    }
    return row;
}

export const Divisibility = new Table(
    divisibility,
    "Divisibility",
    ["A113704", "A051731"],
    "A000000",
    String.raw`[n=0 \text{ or } k \text{ divides } n]`,
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Divisibility));
}

