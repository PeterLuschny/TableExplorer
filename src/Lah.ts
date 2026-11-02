/**
 * Provides the unsigned Lah numbers as a Table.
 *
 * lah(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * T(n, k) = C(n, k) * FallingFactorial(n-1, n-k)
 *         = C(n-1, k-1) * n! / k!
 *
 * Triangle:
 * [0]  1
 * [1]  0,       1
 * [2]  0,       2,        1
 * [3]  0,       6,        6,        1
 * [4]  0,      24,       36,       12,        1
 * [5]  0,     120,      240,      120,       20,       1
 * [6]  0,     720,     1800,     1200,      300,      30,      1
 * [7]  0,    5040,    15120,    12600,     4200,     630,     42,     1
 * [8]  0,   40320,   141120,   141120,    58800,   11760,   1176,    56,    1
 * [9]  0,  362880,  1451520,  1693440,   846720,  211680,  28224,  2016,   72,  1
 *
 * References:
 *   OEIS: A271703, A008297, A066667, A089231, A105278, A111596
 *   Inverse: A111596
 */

import { Table } from './tabltypes';

const lahCache = new Map<number, bigint[]>();

export function lah(n: number): bigint[] {
    if (lahCache.has(n)) return lahCache.get(n)!;

    if (n === 0) {
        const result = [1n];
        lahCache.set(0, result);
        return result;
    }

    const row = [...lah(n - 1), 1n];  // copy previous row and append 1
    row[0] = 0n;
    for (let k = n - 1; k >= 1; k--) {
        row[k] = row[k] * BigInt(n + k - 1) + row[k - 1];
    }

    lahCache.set(n, row);
    return row;
}

export const Lah = new Table(
    lah,
    "Lah",
    ["A271703", "A008297", "A066667", "A089231", "A105278", "A111596"],
    "A111596",
    String.raw`\binom{n}{k} \text{FallingFactorial}(n-1, n-k)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Lah));
}
