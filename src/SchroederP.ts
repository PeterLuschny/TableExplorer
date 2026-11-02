/**
 * Provides the SchroederP triangle as a Table.
 *
 * schroederp(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const schroederPCache = new Map<number, bigint[]>();

export function schroederp(n: number): bigint[] {
    const cached = schroederPCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else {
        row = [...schroederp(n - 1), 1n];
        for (let k = n; k > 0; k--) row[k] = (row[k - 1] * BigInt(2 * n - k)) / BigInt(k);
        row[0] = (row[0] * BigInt(4 * n - 2)) / BigInt(n);
    }
    schroederPCache.set(n, row);
    return row;
}

export const SchroederP = new Table(
    schroederp,
    "SchroederP",
    ["A104684", "A063007"],
    "A000000",
    String.raw`\binom{n}{k} \binom{2n - k}{n}`
);
