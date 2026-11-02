/**
 * Provides the WardSet triangle as a Table.
 *
 * wardset(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const wardSetCache = new Map<number, bigint[]>();

export function wardset(n: number): bigint[] {
    const cached = wardSetCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [0n, 1n];
    else {
        row = [...wardset(n - 1), 0n];
        for (let k = n; k > 0; k--) {
            row[k] = BigInt(k) * row[k] + BigInt(n + k - 1) * row[k - 1];
        }
    }
    wardSetCache.set(n, row);
    return row;
}

export const WardSet = new Table(
    wardset,
    "WardSet",
    ["A269939", "A134991"],
    "",
    String.raw`\sum_{m=0}^{k} (-1)^{m + k} \binom{n+k}{n+m} { n + m \brace m}`
);
