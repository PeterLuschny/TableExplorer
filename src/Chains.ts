/**
 * Provides chains of length k in the partially ordered set
 * formed from subsets of an n-set by inclusion, as a Table.
 *
 * chains(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: ch = [...chains(n-1), 0],
 *   row[0] = 2 * ch[0]
 *   row[n] = n * ch[n-1]
 *   row[k] = k * ch[k-1] + (k+2) * ch[k]  for k = n-1 down to 1
 *
 * Triangle:
 * [0] [  1]
 * [1] [  2,    1]
 * [2] [  4,    5,     2]
 * [3] [  8,   19,    18,     6]
 * [4] [ 16,   65,   110,    84,    24]
 * [5] [ 32,  211,   570,   750,   480,   120]
 * [6] [ 64,  665,  2702,  5460,  5880,  3240,   720]
 * [7] [128, 2059, 12138, 35406, 57120, 52080, 25200, 5040]
 *
 * References:
 *   OEIS: A038719
 */

import { Table } from './tabltypes';

const chainsCache = new Map<number, bigint[]>();

export function chains(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = chainsCache.get(n);
    if (cached !== undefined) return cached;

    const ch = [...chains(n - 1), 0n];
    const row = [...ch];
    row[0] = 2n * ch[0];
    row[n] = BigInt(n) * ch[n - 1];

    for (let k = n - 1; k > 0; k--) {
        row[k] = BigInt(k) * ch[k - 1] + BigInt(k + 2) * ch[k];
    }

    chainsCache.set(n, row);
    return row;
}

export const Chains = new Table(
    chains,
    "Chains",
    ["A038719"],
    "",
    String.raw`\left({n+2 \brace k+2} -  {n+1 \brace k+2} \right)\, k!`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Chains));
}

