/**
 * BinomialDiffPell triangle.
 *
 * [0]    1;
 * [1]    1,    1;
 * [2]    3,    2,    1;
 * [3]    7,    9,    3,    1;
 * [4]   17,   28,   18,    4,    1;
 * [5]   41,   85,   70,   30,    5,    1;
 * [6]   99,  246,  255,  140,   45,    6,   1;
 * [7]  239,  693,  861,  595,  245,   63,   7,   1;
 * [8]  577, 1912, 2772, 2296, 1190,  392,  84,   8, 1;
 * [9] 1393, 5193, 8604, 8316, 5166, 2142, 588, 108, 9, 1;
 *
 * Recurrence: row = [...prev, 1n], then
 *   T(n, k) = T(n-1, k-1) * n / k  for k = 1..n-1
 *   T(n, 0) = 2 * T(n-1, 0) + T(n-2, 0)   (Pell recurrence on column 0)
 *   T(n, n) = 1
 *
 * References:
 *   OEIS: A367564
 */

import { Table } from './tabltypes';

const binomialDiffPellCache = new Map<number, bigint[]>();

function binomialdiffpell(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [1n, 1n];

    const cached = binomialDiffPellCache.get(n);
    if (cached !== undefined) return cached;

    const arow = binomialdiffpell(n - 1);
    const row: bigint[] = [...arow, 1n];

    // Pre-box n once; use an incrementing bigint for k to avoid BigInt(k) each iteration.
    const nBig = BigInt(n);
    let kBig = 1n;
    for (let k = 1; k < n; k++, kBig++) {
        row[k] = (arow[k - 1] * nBig) / kBig;
    }
    // Pell recurrence on column 0: P(n) = 2*P(n-1) + P(n-2).
    // binomialdiffpell(n-2) is already cached at this point.
    row[0] = 2n * arow[0] + binomialdiffpell(n - 2)[0];

    binomialDiffPellCache.set(n, row);
    return row;
}

export const BinomialDiffPell = new Table(
    binomialdiffpell,
    "BinomialDiffPell",
    ["A367564"],
    "A000000",
    String.raw`\frac{1}{2} \binom{n}{k} \left((1-\sqrt{2})^{n-k} + (1+\sqrt{2})^{n-k}\right)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(BinomialDiffPell));
}
