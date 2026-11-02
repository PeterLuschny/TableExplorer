/**
 * Provides the SchroederL triangle as a Table.
 *
 * schroederl(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const schroederLCache = new Map<number, bigint[]>();

export function schroederl(n: number): bigint[] {
    const cached = schroederLCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [1n, 1n];
    else {
        const prev = schroederl(n - 1);
        const interior = Array.from({ length: Math.max(0, prev.length - 2) }, (_, i) => prev[i] + 3n * prev[i + 1] + 2n * prev[i + 2]);
        row = [prev[0] + 2n * prev[1], ...interior, prev[prev.length - 2] + 3n * prev[prev.length - 1], 1n];
    }
    schroederLCache.set(n, row);
    return row;
}

export const SchroederL = new Table(
    schroederl,
    "SchroederL",
    ["A172094"],
    "A000000",
    String.raw`T(n-1, 0) + 2T(n-1, 1), T(n, k) = T(n-1, k-1) + 3T(n-1, k) + 2T(n-1, k+1)`
);
