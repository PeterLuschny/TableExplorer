/**
 * Provides the Naturals triangle as a Table.
 *
 * naturals(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const naturalsCache = new Map<number, bigint[]>();

export function naturals(n: number): bigint[] {
    const cached = naturalsCache.get(n);
    if (cached !== undefined) return cached;
    const start = (n * (n + 1)) / 2;
    const end = ((n + 1) * (n + 2)) / 2;
    const row = Array.from({ length: end - start }, (_, i) => BigInt(start + i + 1));
    naturalsCache.set(n, row);
    return row;
}

export const Naturals = new Table(
    naturals,
    "Naturals",
    ["A000027", "A001477"],
    "",
    String.raw`n+1 + (k+n) (k+n+1)/2`
);
