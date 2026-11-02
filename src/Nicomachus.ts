/**
 * Provides the Nicomachus triangle as a Table.
 *
 * nicomachus(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * T(n, k) = 2^(n-k) * 3^k
 * Recurrence: row = [...prev, 3 * prev[n-1]], then row[k] *= 2 for k = 0..n-1
 *
 * Triangle:
 * [0] [  1]
 * [1] [  2,   3]
 * [2] [  4,   6,   9]
 * [3] [  8,  12,  18,  27]
 * [4] [ 16,  24,  36,  54,  81]
 * [5] [ 32,  48,  72, 108, 162, 243]
 * [6] [ 64,  96, 144, 216, 324, 486,  729]
 * [7] [128, 192, 288, 432, 648, 972, 1458, 2187]
 *
 * References:
 *   OEIS: A036561, A081954, A175840
 */

import { Table } from './tabltypes';

const nicomachusCache = new Map<number, bigint[]>();

export function nicomachus(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = nicomachusCache.get(n);
    if (cached !== undefined) return cached;

    const prev = nicomachus(n - 1);
    const row = [...prev, 3n * prev[n - 1]];
    for (let k = 0; k < n; k++) {
        row[k] *= 2n;
    }

    nicomachusCache.set(n, row);
    return row;
}

export const Nicomachus = new Table(
    nicomachus,
    "Nicomachus",
    ["A036561", "A081954", "A175840"],
    "",
    String.raw`2^{n - k}\, 3^{k}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Nicomachus));
}


