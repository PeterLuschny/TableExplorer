/**
 * Provides the Stirling set numbers (Stirling numbers of the second kind) as a Table.
 *
 * stirlingset(n) computes the n-th row of the Stirling set triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: T(n, k) = T(n-1, k-1) + k * T(n-1, k),  T(0, 0) = 1
 *
 * Triangle:
 * [0]  1
 * [1]  0,   1
 * [2]  0,   1,    1
 * [3]  0,   1,    3,    1
 * [4]  0,   1,    7,    6,    1
 * [5]  0,   1,   15,   25,   10,    1
 * [6]  0,   1,   31,   90,   65,   15,    1
 * [7]  0,   1,   63,  301,  350,  140,   21,   1
 * [8]  0,   1,  127,  966, 1701, 1050,  266,  28,  1
 * [9]  0,   1,  255, 3025, 7770, 6951, 2646, 462, 36, 1
 *
 * References:
 *   OEIS: A048993, A008277, A008278, A080417
 *   Inverse: A132393
 */

import { Table } from './tabltypes';

const stirlingSetCache = new Map<number, bigint[]>();

function stirlingset(n: number): bigint[] {
    if (stirlingSetCache.has(n)) return stirlingSetCache.get(n)!;

    if (n === 0) {
        const result = [1n];
        stirlingSetCache.set(0, result);
        return result;
    }

    const prev = stirlingset(n - 1);
    const row = [0n, ...prev];  // prepend 0, shifting indices: row[k] = prev[k-1]
    for (let k = 1; k < n; k++) {
        row[k] = row[k] + BigInt(k) * row[k + 1];
    }

    stirlingSetCache.set(n, row);
    return row;
}

export const StirlingSet = new Table(
    stirlingset,
    "StirlingSet",
    [
        "A048993", "A008277", "A008278", "A080417",
        "A106800", "A151511", "A151512", "A154959",
        "A213735",
    ],
    "A132393",
    String.raw`{n \brace k}`
);

