/**
 * Provides the falling factorial triangle as a Table.
 * Counts the number of permutations of n things taken k at a time.
 *
 * fallingfactorial(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * T(n, k) = n! / (n - k)!
 *
 * Triangle:
 * [0]  1
 * [1]  1,  1
 * [2]  1,  2,   2
 * [3]  1,  3,   6,    6
 * [4]  1,  4,  12,   24,    24
 * [5]  1,  5,  20,   60,   120,   120
 * [6]  1,  6,  30,  120,   360,   720,    720
 * [7]  1,  7,  42,  210,   840,  2520,   5040,   5040
 * [8]  1,  8,  56,  336,  1680,  6720,  20160,  40320,   40320
 * [9]  1,  9,  72,  504,  3024, 15120,  60480, 181440,  362880,  362880
 *
 * References:
 *   OEIS: A008279, A068424, A094587, A173333, A181511
 */

import { Table } from './tabltypes';

const fallingFactorialCache = new Map<number, bigint[]>();

function fallingfactorial(n: number): bigint[] {
    if (fallingFactorialCache.has(n)) return fallingFactorialCache.get(n)!;

    if (n === 0) {
        const result = [1n];
        fallingFactorialCache.set(0, result);
        return result;
    }

    const r = fallingfactorial(n - 1);
    // Python: row = [n * r[k] for k in range(-1, n)]
    // range(-1, n) yields indices -1, 0, 1, ..., n-1
    // r[-1] in Python is the last element of r, i.e. r[n-1]
    const bn = BigInt(n);
    const row = new Array<bigint>(n + 1);
    row[0] = bn * r[n - 1];   // k = -1 → r[r.length - 1]
    for (let k = 0; k < n; k++) {
        row[k + 1] = bn * r[k];
    }
    row[0] = 1n;

    fallingFactorialCache.set(n, row);
    return row;
}

export const FallingFactorial = new Table(
    fallingfactorial,
    "FallingFactorial",
    ["A008279", "A068424", "A094587", "A173333", "A181511"],
    "",
    String.raw`n! / (n - k)!`
);
