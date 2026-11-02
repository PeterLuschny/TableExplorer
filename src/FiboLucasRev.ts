/**
 * Provides the FiboLucasRev triangle as a Table.
 *
 * fibolucasrev(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';
import { fibolucas } from './FiboLucas';

const fiboLucasRevCache = new Map<number, bigint[]>();

export function fibolucasrev(n: number): bigint[] {
    const cached = fiboLucasRevCache.get(n);
    if (cached !== undefined) return cached;
    const row = n === 0 ? [1n] : [...fibolucas(n)].reverse();
    fiboLucasRevCache.set(n, row);
    return row;
}

export const FiboLucasRev = new Table(
    fibolucasrev,
    "FiboLucasRev",
    ["A124038"],
    "A000000",
    String.raw`T(n - 1, k) + T(n - 2, k - 2)`
);
