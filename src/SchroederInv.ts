/**
 * Provides the SchroederInv triangle as a Table.
 *
 * schroederinv(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const schroederInvCache = new Map<number, bigint[]>();

export function schroederinv(n: number): bigint[] {
    const cached = schroederInvCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [0n, 1n];
    else {
        const prev1 = schroederinv(n - 1);
        const prev2 = schroederinv(n - 2);
        const middle = Array.from({ length: prev2.length }, (_, i) => prev1[i + 1] + prev1[i] + prev2[i]);
        row = [0n, ...middle, 1n];
    }
    schroederInvCache.set(n, row);
    return row;
}

export const SchroederInv = new Table(
    schroederinv,
    "SchroederInv",
    ["A122542", "A035607", "A113413", "A119800", "A266213"],
    "",
    String.raw`T(n-1, k-1) + T(n-1, k) + T(n-2, k- 1)`
);
