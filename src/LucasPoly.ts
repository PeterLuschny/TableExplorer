/**
 * Provides the LucasPoly triangle as a Table.
 *
 * lucaspoly(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const lucasPolyCache = new Map<number, bigint[]>();

export function lucaspoly(n: number): bigint[] {
    const cached = lucasPolyCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [1n, 0n];
    else if (n === 2) row = [1n, 1n, 1n];
    else {
        const rowA = lucaspoly(n - 2);
        row = [...lucaspoly(n - 1), BigInt((n + 1) % 2)];
        row[1] += 1n;
        for (let k = 3; k < n; k++) row[k] += rowA[k - 2];
    }
    lucasPolyCache.set(n, row);
    return row;
}

export const LucasPoly = new Table(
    lucaspoly,
    "LucasPoly",
    ["A374440"],
    "",
    String.raw`T_{n - 1, k} + T_{n - 2, k - 2}`
);
