/**
 * Provides the RootedTree triangle as a Table.
 *
 * rootedtree(n) computes the n-th row of the triangle,
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

const rootedTreeCache = new Map<number, bigint[]>();

export function rootedtree(n: number): bigint[] {
    const cached = rootedTreeCache.get(n);
    if (cached !== undefined) return cached;
    const p = polyatreeacc(n);
    const row = [0n, ...Array.from({ length: n }, (_, k) => p[k + 1] - p[k])];
    rootedTreeCache.set(n, row);
    return row;
}

export const RootedTree = new Table(
    rootedtree,
    "RootedTree",
    ["A034781"],
    "",
    String.raw`A375467(n, k) - A375467(n, k - 1)`
);
