/**
 * Central cycle factorial numbers.
 *
 * [0] [1]
 * [1] [0,    1]
 * [2] [0,    2,     3]
 * [3] [0,    6,    20,     15]
 * [4] [0,   24,   130,    210,    105]
 * [5] [0,  120,   924,   2380,   2520,    945]
 * [6] [0,  720,  7308,  26432,  44100,  34650,  10395]
 * [7] [0, 5040, 64224, 303660, 705320, 866250, 540540, 135135]
 *
 * Recurrence: row = [...prev, 0n], then backward:
 *   T(n, k) = (n + k - 1) * (T(n-1, k) + T(n-1, k-1))  for k = n..1
 *
 * References:
 *   OEIS: A269940, A111999, A259456
 */

import { Table } from './tabltypes';

const centralCycleCache = new Map<number, bigint[]>();

export function centralcycle(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];

    const cached = centralCycleCache.get(n);
    if (cached !== undefined) return cached;

    const row = [...centralcycle(n - 1), 0n];

    // Pre-box n once; use a decrementing bigint for k to avoid BigInt(k) each iteration.
    const nBig = BigInt(n);
    let kBig = nBig;
    for (let k = n; k >= 1; k--, kBig--) {
        row[k] = (nBig + kBig - 1n) * (row[k] + row[k - 1]);
    }

    centralCycleCache.set(n, row);
    return row;
}

export const CentralCycle = new Table(
    centralcycle,
    "CentralCycle",
    ["A269940", "A111999", "A259456"],
    "",
    String.raw`\sum_{m=0}^k (-1)^{m+k} \binom{n+k}{n+m} \left[{n+m \atop m}\right]`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(CentralCycle));
}
