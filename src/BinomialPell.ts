/**
 * Provides the BinomialPell triangle as a Table.
 *
 * binomialpell(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const binomialPellCache = new Map<number, bigint[]>();

export function binomialpell(n: number): bigint[] {
    const cached = binomialPellCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) {
        row = [1n];
    } else if (n === 1) {
        row = [2n, 2n];
    } else {
        const prev = binomialpell(n - 1);
        row = [...prev, BigInt(n + 1)];
        for (let k = 1; k < n; k++) {
            row[k] = (prev[k - 1] * BigInt(n + 1)) / BigInt(k);
        }
        row[0] = 2n * prev[0] + binomialpell(n - 2)[0];
    }
    binomialPellCache.set(n, row);
    return row;
}

export const BinomialPell = new Table(
    binomialpell,
    "BinomialPell",
    ["A367211"],
    "",
    String.raw`\binom{n+1}{k}\, \text{Pell}(n+1-k)`
);
