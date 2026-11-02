/**
 * Provides the Ordinals triangle as a Table.
 *
 * ordinals(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const ordinalsCache = new Map<number, bigint[]>();

export function ordinals(n: number): bigint[] {
    const cached = ordinalsCache.get(n);
    if (cached !== undefined) return cached;
    const row = n === 0 ? [0n] : [...ordinals(n - 1), BigInt(n)];
    ordinalsCache.set(n, row);
    return row;
}

export const Ordinals = new Table(
    ordinals,
    "Ordinals",
    ["A002262", "A002260", "A004736", "A025581"],
    "",
    String.raw`k`
);
