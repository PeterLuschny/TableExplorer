/**
 * Inverse triangle of the central set factorial numbers.
 *
 * [0] [1]
 * [1] [0,      1]
 * [2] [0,      1,      1]
 * [3] [0,      4,      5,      1]
 * [4] [0,     36,     49,     14,     1]
 * [5] [0,    576,    820,    273,    30,    1]
 * [6] [0,  14400,  21076,   7645,  1023,   55,  1]
 * [7] [0, 518400, 773136, 296296, 44473, 3003, 91, 1]
 *
 * Recurrence: row = [...prev, 1n], then backward:
 *   T(n, k) = (n-1)² * T(n-1, k) + T(n-1, k-1)  for k = n-1..1
 *
 * Backward traversal ensures each read of row[k-1] still holds the
 * previous-row value before it is overwritten at the next (lower-k) step.
 *
 * References:
 *   OEIS: A269944, A204579
 *   Inverse: A269945
 */

import { Table } from './tabltypes';

const centralSetInvCache = new Map<number, bigint[]>();

function centralsetinv(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];

    const cached = centralSetInvCache.get(n);
    if (cached !== undefined) return cached;

    const row = [...centralsetinv(n - 1), 1n];

    // (n-1)² computed once in bigint before the loop.
    const nm1 = BigInt(n - 1);
    const nm1sq = nm1 * nm1;
    for (let k = n - 1; k >= 1; k--) {
        row[k] = nm1sq * row[k] + row[k - 1];
    }

    centralSetInvCache.set(n, row);
    return row;
}

export const CentralSetInv = new Table(
    centralsetinv,
    "CentralSetInv",
    ["A269944", "A204579"],
    "A269945",
    String.raw`T(n,k) = (n-1)^2 \, T(n-1,k) + T(n-1,k-1)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(CentralSetInv));
}
