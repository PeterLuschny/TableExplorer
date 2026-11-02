/**
 * Provides the CompositionLP triangle as a Table.
 *
 * T(n, k) = number of compositions of n with largest part k.
 * Example: T(5, 3) = 5 because card({3+2, 2+3, 3+1+1, 1+3+1, 1+1+3}) = 5.
 *
 * Triangle:
 *   [0]  1;
 *   [1]  0,  1;
 *   [2]  0,  1,  1;
 *   [3]  0,  1,  2,   1;
 *   [4]  0,  1,  4,   2,   1;
 *   [5]  0,  1,  7,   5,   2,  1;
 *   [6]  0,  1, 12,  11,   5,  2,  1;
 *   [7]  0,  1, 20,  23,  12,  5,  2,  1;
 *   [8]  0,  1, 33,  47,  27, 12,  5,  2, 1;
 *   [9]  0,  1, 54,  94,  59, 28, 12,  5, 2, 1;
 *
 * References:
 *   OEIS: A048004
 */

import { Table } from './tabltypes';

const clpCache = new Map<string, bigint>();

function clp(n: number, k: number): bigint {
    if (k < 0 || k > n) return 0n;
    if (k === 0 || k === n) return 1n;

    const key = `${n},${k}`;
    const cached = clpCache.get(key);
    if (cached !== undefined) return cached;

    const result =
        2n * clp(n - 1, k)
        + clp(n - 1, k - 1)
        - 2n * clp(n - 2, k - 1)
        + clp(n - k - 1, k - 1)
        - clp(n - k - 2, k);

    clpCache.set(key, result);
    return result;
}

export function compositionlp(n: number): bigint[] {
    if (n === 0) return [1n];

    const row: bigint[] = [];
    for (let k = 0; k <= n; k++) {
        row.push(clp(n - 1, k - 1));
    }
    return row;
}

export const CompositionLP = new Table(
    compositionlp,
    "CompositionLP",
    ["A048004"],
    "A000000",
    String.raw`C_{LP}(n, k)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(CompositionLP));
}

