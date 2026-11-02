/**
 * Provides the NimSum triangle as a Table.
 *
 * nimsum(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const nimSumCache = new Map<number, bigint[]>();

export function nimsum(n: number): bigint[] {
    const cached = nimSumCache.get(n);
    if (cached !== undefined) return cached;
    const row = Array.from({ length: n + 1 }, (_, k) => BigInt(k ^ (n - k)));
    nimSumCache.set(n, row);
    return row;
}

export const NimSum = new Table(
    nimsum,
    "NimSum",
    ["A003987"],
    "",
    String.raw`k \ \text{XOR} \ (n - k)`
);
