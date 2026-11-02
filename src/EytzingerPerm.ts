/**
 * Provides the EytzingerPerm triangle as a Table.
 *
 * eytzingerperm(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';
import { eytzingerorder } from './EytzingerOrder';

const eytzingerPermCache = new Map<number, bigint[]>();

export function eytzingerperm(n: number): bigint[] {
    const cached = eytzingerPermCache.get(n);
    if (cached !== undefined) return cached;
    const t = BigInt((n * (n + 1)) / 2);
    const order = eytzingerorder(n);
    const row = Array.from({ length: n + 1 }, (_, k) => order[k] + t);
    eytzingerPermCache.set(n, row);
    return row;
}

export const EytzingerPerm = new Table(
    eytzingerperm,
    "EytzingerPerm",
    ["A375469"],
    "",
    String.raw`%%`
);
