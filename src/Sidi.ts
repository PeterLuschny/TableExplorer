/**
 * Provides the Sidi triangle as a Table.
 *
 * sidi(n) computes the n-th row of the triangle,
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

const sidiCache = new Map<number, bigint[]>();

export function sidi(n: number): bigint[] {
    const cached = sidiCache.get(n);
    if (cached !== undefined) return cached;
    const brow = binomial(n);
    const row = Array.from({ length: n + 1 }, (_, k) => {
        const sign = ((n - k) & 1) === 0 ? 1n : -1n;
        return sign * brow[k] * (BigInt(k) ** BigInt(n));
    });
    sidiCache.set(n, row);
    return row;
}

export const Sidi = new Table(
    sidi,
    "Sidi",
    ["A258773"],
    "",
    String.raw`(-1)^(n-k) \binom{n}{k} k^n`
);
