/**
 * Provides the WardCycle triangle as a Table.
 *
 * wardcycle(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const wardCycleCache = new Map<number, bigint[]>();

export function wardcycle(n: number): bigint[] {
    const cached = wardCycleCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [0n, 1n];
    else {
        row = [...wardcycle(n - 1), 0n];
        for (let k = n; k > 0; k--) row[k] = BigInt(n + k - 1) * (row[k - 1] + row[k]);
    }
    wardCycleCache.set(n, row);
    return row;
}

export const WardCycle = new Table(
    wardcycle,
    "WardCycle",
    ["A269940", "A111999", "A259456"],
    "",
    String.raw`\sum_{m=0}^{k} (-1)^{m+k} \binom{n+k}{n+m} { n + m \brack m}`
);
