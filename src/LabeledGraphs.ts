/**
 * Provides the LabeledGraphs triangle as a Table.
 *
 * labeledgraphs(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const labeledGraphsCache = new Map<number, bigint[]>();

export function labeledgraphs(n: number): bigint[] {
    const cached = labeledGraphsCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else {
        row = new Array<bigint>(n + 1).fill(0n);
        let pow2 = 1n << BigInt(((n - 1) * (n - 2)) / 2);
        let binom = 1n;
        for (let k = 1; k < n; k++) {
            row[k] = pow2 * binom * labeledgraphs(k)[k];
            pow2 >>= BigInt(n - k - 1);
            if (k < n - 1) {
                binom = (binom * BigInt(n - k)) / BigInt(k);
            }
        }
        row[n] = (1n << BigInt(((n - 1) * n) / 2)) - row.slice(1, n).reduce((a, b) => a + b, 0n);
    }
    labeledGraphsCache.set(n, row);
    return row;
}

export const LabeledGraphs = new Table(
    labeledgraphs,
    "LabeledGraphs",
    ["A360603"],
    "",
    String.raw`2^{\binom{n-k}{2}} \binom{n-1}{k-1} \text{A001187}(k)`
);
