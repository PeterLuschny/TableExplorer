/**
 * Provides the PolyaTree triangle as a Table.
 *
 * polyatree(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';
import { polyatreeacc } from './PolyaTreeAcc';

const polyaTreeCache = new Map<number, bigint[]>();

export function polyatree(n: number): bigint[] {
    const cached = polyaTreeCache.get(n);
    if (cached !== undefined) return cached;
    const p = polyatreeacc(n);
    const row = [n < 1 ? 1n : 0n];
    for (let k = 1; k <= n; k++) row.push(p[k] - p[k - 1]);
    polyaTreeCache.set(n, row);
    return row;
}

export const PolyaTree = new Table(
    polyatree,
    "PolyaTree",
    ["A034781"],
    "",
    String.raw`A375467(n, k) - A375467(n, k - 1)`
);
