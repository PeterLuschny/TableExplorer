/**
 * Central set factorial numbers.
 *
 * [0] [1]
 * [1] [0, 1]
 * [2] [0, 1,    1]
 * [3] [0, 1,    5,      1]
 * [4] [0, 1,   21,     14,      1]
 * [5] [0, 1,   85,    147,     30,     1]
 * [6] [0, 1,  341,   1408,    627,    55,    1]
 * [7] [0, 1, 1365,  13013,  11440,  2002,   91,   1]
 * [8] [0, 1, 5461, 118482, 196053, 61490, 5278, 140,  1]
 *
 * Recurrence: row = [...prev, 1n], then backward:
 *   T(n, k) = k² * T(n-1, k) + T(n-1, k-1)  for k = n-1..2
 *
 * Backward traversal ensures each read of row[k-1] still holds the
 * previous-row value before it is overwritten at the next (lower-k) step.
 *
 * References:
 *   OEIS: A269945, A008957, A036969
 *   Inverse: A269944 (also A204579)
 */

import { Table } from './tabltypes';

const centralSetCache = new Map<number, bigint[]>();

function centralset(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];

    const cached = centralSetCache.get(n);
    if (cached !== undefined) return cached;

    const row = [...centralset(n - 1), 1n];

    // Use a decrementing bigint for k to avoid BigInt(k) inside the loop.
    let kBig = BigInt(n - 1);
    for (let k = n - 1; k >= 2; k--, kBig--) {
        row[k] = kBig * kBig * row[k] + row[k - 1];
    }

    centralSetCache.set(n, row);
    return row;
}

export const CentralSet = new Table(
    centralset,
    "CentralSet",
    ["A269945", "A008957", "A036969"],
    "A269944",
    String.raw`k = n \;?\; 1 : T(n-1,k-1) + k^2 \, T(n-1,k)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(CentralSet));
}
