
/**
 * Coefficients of Charlier polynomials.
 *
 * [0] [1]
 * [1] [1, -1]
 * [2] [1, -3, 1]
 * [3] [1, -6, 8, -1]
 * [4] [1, -10, 29, -24, 1]
 * [5] [1, -15, 75, -145, 89, -1]
 * [6] [1, -21, 160, -545, 814, -415, 1]
 * [7] [1, -28, 301, -1575, 4179, -5243, 2372, -1]
 * [8] [1, -36, 518, -3836, 15659, -34860, 38618, -16072, 1]
 *
 * Recurrence:
 *   - Base: [1], [1, -1]
 *   - For n >= 2:
 *       prev1 = charlier(n-1)
 *       prev2 = [0, ...charlier(n-2)]
 *       sign = (-1)^n
 *       middle[k] = prev1[k+1] - n*prev1[k] - (n-1)*prev2[k] for k=0..n-2
 *       row = [1, ...middle, sign]
 *
 * References:
 *   OEIS: A046716, A094816
 */

import { Table } from './tabltypes';

const charlierCache = new Map<number, bigint[]>();

export function charlier(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [1n, -1n];

    const cached = charlierCache.get(n);
    if (cached !== undefined) return cached;

    const prev1 = charlier(n - 1);
    const prev2 = [0n, ...charlier(n - 2)];
    const nBig = BigInt(n);
    const nm1Big = BigInt(n - 1);
    const middle: bigint[] = [];
    for (let k = 0; k < n - 1; k++) {
        // prev1[k+1] - n*prev1[k] - (n-1)*prev2[k]
        middle.push(prev1[k + 1] - nBig * prev1[k] - nm1Big * prev2[k]);
    }
    const sign = (n % 2 === 0) ? 1n : -1n;
    const row = [1n, ...middle, sign];
    charlierCache.set(n, row);
    return row;
}

export const Charlier = new Table(
    charlier,
    "Charlier",
    ["A046716", "A094816"],
    "A000000",
    String.raw`\sum_{j=0}^{k} (-1)^k \, \binom{n}{k-j}\,{j+n-k \brack n-k}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Charlier));
}
