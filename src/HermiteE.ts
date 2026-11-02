/**
 * Provides the HermiteE triangle as a Table.
 *
 * hermitee(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const hermiteECache = new Map<number, bigint[]>();

export function hermitee(n: number): bigint[] {
    const cached = hermiteECache.get(n);
    if (cached !== undefined) return cached;
    const row = new Array<bigint>(n + 1).fill(0n);
    row[n] = 1n;
    for (let k = n - 2; k >= 0; k -= 2) {
        row[k] = (row[k + 2] * BigInt(k + 2) * BigInt(k + 1)) / BigInt(n - k);
    }
    hermiteECache.set(n, row);
    return row;
}

export const HermiteE = new Table(
    hermitee,
    "HermiteE",
    ["A099174", "A066325", "A073278"],
    "A000000",
    String.raw`is(n - k \text{ odd})\, ? \, 0 : \frac{n!}{k!} \, \frac{1}{(n-k)!!} )`
);
