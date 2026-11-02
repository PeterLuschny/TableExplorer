/**
 * Provides the CTree triangle as a Table.
 *
 * ctree(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const ctreeCache = new Map<number, bigint[]>();

export function ctree(n: number): bigint[] {
    const cached = ctreeCache.get(n);
    if (cached !== undefined) return cached;
    const row = n % 2 === 1
        ? Array.from({ length: n + 1 }, () => 1n)
        : [...Array.from({ length: n / 2 }, () => [1n, 0n]).flat(), 1n];
    ctreeCache.set(n, row);
    return row;
}

export const CTree = new Table(
    ctree,
    "CTree",
    ["A106465", "A106470"],
    "A000000",
    String.raw`is(n \text{ odd})\ ? \ 1 : (k + 1) \text{ mod } 2`
);
