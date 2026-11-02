/**
 * Provides the Euler-Bernoulli (Entringer) triangle as a Table.
 *
 * entringer(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * row = [0, ...reverse_prefix_sums(entringer(n-1))]
 * Computed as a single backward pass: read prev right-to-left,
 * accumulate into row[1..n].
 *
 * Triangle:
 * [0] [1]
 * [1] [0,   1]
 * [2] [0,   1,   1]
 * [3] [0,   1,   2,   2]
 * [4] [0,   2,   4,   5,    5]
 * [5] [0,   5,  10,  14,   16,   16]
 * [6] [0,  16,  32,  46,   56,   61,   61]
 * [7] [0,  61, 122, 178,  224,  256,  272,  272]
 *
 * References:
 *   OEIS: A008281, A008282, A010094
 */

import { Table } from './tabltypes';

const entringerCache = new Map<number, bigint[]>();

export function entringer(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = entringerCache.get(n);
    if (cached !== undefined) return cached;

    const prev = entringer(n - 1);
    const row = new Array<bigint>(n + 1);
    row[0] = 0n;
    let acc = 0n;
    for (let i = n - 1; i >= 0; i--) {
        acc += prev[i];
        row[n - i] = acc;
    }

    entringerCache.set(n, row);
    return row;
}

export const Entringer = new Table(
    entringer,
    "Entringer",
    ["A008281", "A008282", "A010094"],
    "",
    String.raw`is(k=0) \ ? \ 0^n : T(n, k-1) + T(n-1, n-k)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Entringer));
}


