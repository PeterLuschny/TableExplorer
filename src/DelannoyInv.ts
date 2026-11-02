/**
 * Provides the inverse of the Delannoy triangle (unsigned) as a Table.
 *
 * delannoyinv(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Build suffix sums of previous row, then:
 *   middle[i] = suffix[i] + suffix[i+1]  for i = 0..n-2
 *   row = [suffix[0], ...middle, suffix[n-1]]
 *
 * Triangle:
 * [0]     1;
 * [1]     1,     1;
 * [2]     2,     3,     1;
 * [3]     6,    10,     5,     1;
 * [4]    22,    38,    22,     7,    1;
 * [5]    90,   158,    98,    38,    9,    1;
 * [6]   394,   698,   450,   194,   58,   11,   1;
 * [7]  1806,  3218,  2126,   978,  334,   82,  13,   1;
 * [8]  8558, 15310, 10286,  4942, 1838,  526, 110,  15,  1;
 *
 * References:
 *   OEIS: A132372, A103136, A033878
 *   Inverse: A008288 (Delannoy)
 */

import { Table } from './tabltypes';

const delannoyInvCache = new Map<number, bigint[]>();

function suffixSums(row: bigint[]): bigint[] {
    const suffix = new Array<bigint>(row.length).fill(0n);
    let total = 0n;
    for (let k = row.length - 1; k >= 0; k--) {
        total += row[k];
        suffix[k] = total;
    }
    return suffix;
}

export function delannoyinv(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = delannoyInvCache.get(n);
    if (cached !== undefined) return cached;

    const suffix = suffixSums(delannoyinv(n - 1));
    const middle = suffix.slice(0, -1).map((s, i) => s + suffix[i + 1]);
    const result = [suffix[0], ...middle, suffix[suffix.length - 1]];

    delannoyInvCache.set(n, result);
    return result;
}

export const DelannoyInv = new Table(
    delannoyinv,
    "DelannoyInv",
    ["A132372", "A103136", "A033878"],
    "A008288",
    String.raw`%%`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(DelannoyInv));
}

