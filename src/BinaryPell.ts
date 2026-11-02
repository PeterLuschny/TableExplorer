/**
 * Provides the Binary Pell triangle as a Table.
 *
 * binarypell(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * T(n, k) = C(n, k) * 2^(n-k)
 *
 * Triangle:
 * [0] [  1]
 * [1] [  2,    1]
 * [2] [  4,    4,    1]
 * [3] [  8,   12,    6,    1]
 * [4] [ 16,   32,   24,    8,    1]
 * [5] [ 32,   80,   80,   40,   10,   1]
 * [6] [ 64,  192,  240,  160,   60,  12,   1]
 * [7] [128,  448,  672,  560,  280,  84,  14,  1]
 * [8] [256, 1024, 1792, 1792, 1120, 448, 112, 16, 1]
 *
 * References:
 *   OEIS: A038207
 *   Inverse: A065109 (involutory)
 */

import { Table } from './tabltypes';

const binaryPellCache = new Map<number, bigint[]>();

export function binarypell(n: number): bigint[] {
    if (binaryPellCache.has(n)) return binaryPellCache.get(n)!;

    if (n === 0) {
        const result = [1n];
        binaryPellCache.set(0, result);
        return result;
    }

    const arow = binarypell(n - 1);
    const row = [...arow, 1n];  // copy arow and append 1
    for (let k = n - 1; k >= 1; k--) {
        row[k] = arow[k - 1] + 2n * arow[k];
    }
    row[0] = 2n * arow[0];

    binaryPellCache.set(n, row);
    return row;
}

export const BinaryPell = new Table(
    binarypell,
    "BinaryPell",
    ["A038207"],
    "A065109",
    String.raw`\binom{n}{k} \, 2^{n-k}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(BinaryPell));
}

