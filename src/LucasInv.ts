/**
 * Provides the LucasInv triangle as a Table.
 *
 * lucasinv(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const lucasInvCache = new Map<number, bigint[]>();

export function lucasinv(n: number): bigint[] {
    const cached = lucasInvCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else {
        row = [1n, ...lucasinv(n - 1)];
        for (let k = 1; k < n; k++) row[k] += 2n * row[k + 1];
    }
    lucasInvCache.set(n, row);
    return row;
}

export const LucasInv = new Table(
    lucasinv,
    "LucasInv",
    ["A112857"],
    "A029635",
    String.raw`\sum_{j=k}^n \binom{n}{j} \binom{j-1}{k-1}`
);
