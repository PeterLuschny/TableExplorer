/**
 * Provides the HermiteH triangle as a Table.
 *
 * hermiteh(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const hermiteHCache = new Map<number, bigint[]>();

export function hermiteh(n: number): bigint[] {
    const cached = hermiteHCache.get(n);
    if (cached !== undefined) return cached;
    const row = new Array<bigint>(n + 1).fill(0n);
    row[n] = 2n ** BigInt(n);
    for (let k = n - 2; k >= 0; k -= 2) {
        row[k] = (row[k + 2] * BigInt(k + 2) * BigInt(k + 1)) / (2n * BigInt(n - k));
    }
    hermiteHCache.set(n, row);
    return row;
}

export const HermiteH = new Table(
    hermiteh,
    "HermiteH",
    ["A060821"],
    "",
    String.raw`is(n - k odd)\, ? \, 0 : (-1)^{(n-k)/2} \ \frac{n!}{k!} \ \frac{2^k}{((n-k)/2)!}`
);
