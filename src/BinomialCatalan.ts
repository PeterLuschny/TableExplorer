/**
 * BinomialCatalan triangle.
 *
 * T(n, k) = binomial(n, k) * Catalan(n - k)
 *         = CatalanNumber(k) * Pochhammer(-n, k) / k!
 *
 * [0] 1;
 * [1] 1, 1;
 * [2] 1, 2,  2;
 * [3] 1, 3,  6,   5;
 * [4] 1, 4, 12,  20,  14;
 * [5] 1, 5, 20,  50,  70,  42;
 * [6] 1, 6, 30, 100, 210, 252, 132;
 * [7] 1, 7, 42, 175, 490, 882, 924, 429;
 */

import { Table } from './tabltypes';

const binomialCatalanCache = new Map<number, bigint[]>();

export function binomialcatalan(n: number): bigint[] {
    if (binomialCatalanCache.has(n)) return binomialCatalanCache.get(n)!;

    if (n === 0) {
        const result = [1n];
        binomialCatalanCache.set(0, result);
        return result;
    }

    const a: bigint[] = [...binomialcatalan(n - 1), 0n];
    const row: bigint[] = new Array(n + 1).fill(0n);
    row[0] = 1n;
    row[1] = BigInt(n);
    for (let k = 2; k <= n; k++) {
        row[k] = (a[k] * BigInt(n + k + 1) + a[k - 1] * BigInt(4 * k - 2)) / BigInt(n + 1);
    }

    binomialCatalanCache.set(n, row);
    return row;
}

export const BinomialCatalan = new Table(
    binomialcatalan,
    "BinomialCatalan",
    ["A124644", "A098474"],
    "A000000",
    String.raw`\binom{n}{k} \text{Catalan}(n - k)`,
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(BinomialCatalan));
}

