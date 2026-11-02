/**
 * Provides the Genocchi triangle as a Table.
 *
 * genocchi(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: row = [0, ...genocchi(n-1), 0],
 *   then backward pass: row[k] += row[k+1]  for k = n down to 1
 *   then forward pass:  row[k] += row[k-1]  for k = 2 to n+1
 *   return row[1..]
 *
 * Triangle:
 * [0] [     1]
 * [1] [     1,      1]
 * [2] [     2,      3,      3]
 * [3] [     8,     14,     17,     17]
 * [4] [    56,    104,    138,    155,    155]
 * [5] [   608,   1160,   1608,   1918,   2073,   2073]
 * [6] [  9440,  18272,  25944,  32008,  36154,  38227,  38227]
 * [7] [198272, 387104, 557664, 702280, 814888, 891342, 929569, 929569]
 *
 * References:
 *   OEIS: A297703
 */

import { Table } from './tabltypes';

const genocchiCache = new Map<number, bigint[]>();

export function genocchi(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = genocchiCache.get(n);
    if (cached !== undefined) return cached;

    const row = [0n, ...genocchi(n - 1), 0n];

    for (let k = n; k > 0; k--) {
        row[k] += row[k + 1];
    }
    for (let k = 2; k < n + 2; k++) {
        row[k] += row[k - 1];
    }

    const result = row.slice(1);
    genocchiCache.set(n, result);
    return result;
}

export const Genocchi = new Table(
    genocchi,
    "Genocchi",
    ["A297703"],
    "",
    String.raw`%%`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Genocchi));
}

