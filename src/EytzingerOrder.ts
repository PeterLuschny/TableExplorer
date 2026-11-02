/**
 * Provides the EytzingerOrder triangle as a Table.
 *
 * eytzingerorder(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const eytzingerOrderCache = new Map<number, bigint[]>();

export function eytzingerorder(n: number): bigint[] {
    const cached = eytzingerOrderCache.get(n);
    if (cached !== undefined) return cached;
    const row = new Array<number>(n + 1).fill(0);
    const rec = (k: number, i: number): number => {
        if (k <= n + 1) {
            i = rec(2 * k, i);
            row[k - 1] = i;
            i = rec(2 * k + 1, i + 1);
        }
        return i;
    };
    rec(1, 0);
    const out = row.map((v) => BigInt(v));
    eytzingerOrderCache.set(n, out);
    return out;
}

export const EytzingerOrder = new Table(
    eytzingerorder,
    "EytzingerOrder",
    ["A375825"],
    "",
    String.raw`%%`
);
