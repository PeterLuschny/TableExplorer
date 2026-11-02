/**
 * Provides the Abel polynomial triangle as a Table.
 *
 * abel(n) computes the coefficients of the n-th Abel polynomial,
 * returned as a bigint[] of length n+1.
 *
 * T(n, k) = C(n-1, k-1) * n^(n-k)  for k > 0
 * T(n, 0) = 0^n                      (i.e. 1 for n=0, else 0)
 *
 * Triangle (unsigned coefficients):
 * [0] [1]
 * [1] [0,        1]
 * [2] [0,        2,       1]
 * [3] [0,        9,       6,       1]
 * [4] [0,       64,      48,      12,      1]
 * [5] [0,      625,     500,     150,     20,      1]
 * [6] [0,     7776,    6480,    2160,    360,     30,    1]
 * [7] [0,   117649,  100842,   36015,   6860,    735,   42,   1]
 * [8] [0,  2097152, 1835008,  688128, 143360,  17920, 1344,  56, 1]
 *
 * References:
 *   Variants: https://oeis.org/A137452, A061356, A139526
 *   Inverse:  A059297 (idempotent numbers triangle)
 *   Overview: https://peterluschny.github.io/tabl/Abel.html
 */

import { Table } from './tabltypes';

const abelCache = new Map<number, bigint[]>();

function abel(n: number): bigint[] {
    if (abelCache.has(n)) return abelCache.get(n)!;

    if (n === 0) {
        const result = [1n];
        abelCache.set(0, result);
        return result;
    }

    const row = new Array<bigint>(n + 1).fill(0n);
    let c = 1n;                          // C(n-1, k-1), starts at C(n-1, 0) = 1
    let p = BigInt(n) ** BigInt(n - 1);  // n^(n-k) for k = 1

    for (let k = 1; k <= n; k++) {
        row[k] = c * p;
        if (k < n) {
            // Advance C(n-1, k-1) -> C(n-1, k): multiply by (n-k), divide by k (exact)
            c = c * BigInt(n - k) / BigInt(k);
            // Advance n^(n-k) -> n^(n-k-1): divide by n (exact)
            p = p / BigInt(n);
        }
    }

    abelCache.set(n, row);
    return row;
}

export const Abel = new Table(
    abel,
    "Abel",
    ["A137452", "A061356", "A139526"],
    "A059297",
    String.raw`is(k = 0)\ ? \ 0^n : \binom{n-1}{k-1} (-n)^{n - k}`
);
