/**
 * BinomialBell triangle.
 *
 * T(n, k) = if k == 0 then Bell(n) else binomial(n-1, k-1) * Bell(n - k)
 *
 * [0]     1
 * [1]     1,    1
 * [2]     2,    2,    1
 * [3]     5,    6,    3,    1
 * [4]    15,   20,   12,    4,    1
 * [5]    52,   75,   50,   20,    5,   1
 * [6]   203,  312,  225,  100,   30,   6,  1
 * [7]   877, 1421, 1092,  525,  175,  42,  7, 1
 * [8]  4140, 7016, 5684, 2912, 1050, 280, 56, 8, 1
 *
 * Recurrence: row = [...prev, 1n], then backward fill
 *   a[j] = a[j-1] * n / j  for j = n-1 down to 1
 *   a[0] = sum(prev)
 *
 * The backward traversal ensures each a[j-1] read uses the still-unmodified
 * previous-row value before it is overwritten at the next iteration step.
 *
 * References:
 *   OEIS: A056857, A056860
 */

import { Table } from './tabltypes';

const binomialbellCache = new Map<number, bigint[]>();

export function binomialbell(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [1n, 1n];

    const cached = binomialbellCache.get(n);
    if (cached !== undefined) return cached;

    const prev = binomialbell(n - 1);
    // Sum the previous row before mutation; avoids a second pass over the array.
    const s = prev.reduce((acc, v) => acc + v, 0n);

    const a = [...prev, 1n];

    // Pre-box n once to avoid repeated BigInt() conversion inside the loop.
    const nBig = BigInt(n);
    for (let j = n - 1; j >= 1; j--) {
        a[j] = (a[j - 1] * nBig) / BigInt(j);
    }
    a[0] = s;

    binomialbellCache.set(n, a);
    return a;
}

export const BinomialBell = new Table(
    binomialbell,
    "BinomialBell",
    ["A056857", "A056860"],
    "",
    String.raw`\binom{n-1}{k-1} \operatorname{Bell}(n-k)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(BinomialBell));
}
