/**
 * Provides the Stirling cycle numbers (unsigned Stirling numbers of the first kind) as a Table.
 *
 * stirlingcycle(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: T(n, k) = T(n-1, k-1) + (n-1) * T(n-1, k),  T(0, 0) = 1
 *
 * Triangle:
 * [0]  1
 * [1]  0,     1
 * [2]  0,     1,      1
 * [3]  0,     2,      3,      1
 * [4]  0,     6,     11,      6,     1
 * [5]  0,    24,     50,     35,    10,     1
 * [6]  0,   120,    274,    225,    85,    15,    1
 * [7]  0,   720,   1764,   1624,   735,   175,   21,   1
 * [8]  0,  5040,  13068,  13132,  6769,  1960,  322,  28,  1
 * [9]  0, 40320, 109584, 118124, 67284, 22449, 4536, 546, 36, 1
 *
 * References:
 *   OEIS: A132393, A008275, A008276, A048994, A054654, A094638, A130534
 */

import { Table } from './tabltypes';

const stirlingCycleCache = new Map<number, bigint[]>();

export function stirlingcycle(n: number): bigint[] {
    if (stirlingCycleCache.has(n)) return stirlingCycleCache.get(n)!;

    if (n === 0) {
        const result = [1n];
        stirlingCycleCache.set(0, result);
        return result;
    }

    const prev = stirlingcycle(n - 1);
    const row = [0n, ...prev];  // prepend 0, shifting indices: row[k] = prev[k-1]
    const bn1 = BigInt(n - 1);
    for (let k = 1; k < n; k++) {
        row[k] = row[k] + bn1 * row[k + 1];
    }

    stirlingCycleCache.set(n, row);
    return row;
}

export const StirlingCycle = new Table(
    stirlingcycle,
    "StirlingCycle",
    ["A132393", "A008275", "A008276", "A048994", "A054654", "A094638", "A130534"],
    "A000000",
    String.raw`{n \brack k}`
);

/** npx ts-node StirlingCycle.ts */
if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(StirlingCycle));
}

