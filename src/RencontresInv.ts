/**
 * Provides the RencontresInv triangle as a Table.
 *
 * rencontresinv(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';
import { binomial } from './Binomial';

const rencontresInvCache = new Map<number, bigint[]>();

export function rencontresinv(n: number): bigint[] {
    const cached = rencontresInvCache.get(n);
    if (cached !== undefined) return cached;
    const row = n === 0
        ? [1n]
        : [...Array.from({ length: n }, (_, k) => BigInt(n - k - 1) * binomial(n)[k]), 1n];
    rencontresInvCache.set(n, row);
    return row;
}

export const RencontresInv = new Table(
    rencontresinv,
    "RencontresInv",
    ["A055137"],
    "A008290",
    String.raw`\binom{n}{k} (n-k-1)`
);
