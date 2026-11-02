/**
 * Provides the Jacobsthal triangle as a Table.
 *
 * jacobsthal(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const jacobsthalCache = new Map<number, bigint[]>();

export function jacobsthal(n: number): bigint[] {
    const cached = jacobsthalCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [1n, 1n];
    else if (n === 2) row = [1n, 2n, 1n];
    else {
        const j1 = jacobsthal(n - 1);
        const j2 = [...jacobsthal(n - 2), 0n];
        row = new Array<bigint>(n + 1).fill(1n);
        for (let k = 1; k < n; k++) row[k] = j1[k - 1] + j1[k] + 2n * j2[k];
        row[0] = j1[0] + 2n * j2[0];
    }
    jacobsthalCache.set(n, row);
    return row;
}

export const Jacobsthal = new Table(
    jacobsthal,
    "Jacobsthal",
    ["A322942"],
    "A000000",
    String.raw`[x^k]\ ((x+1)\, \mathrm{J}(n-1, x) + 2\, \mathrm{J}(n-2, x))`
);
