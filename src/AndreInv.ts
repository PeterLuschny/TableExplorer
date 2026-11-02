/**
 * Provides the AndreInv triangle as a Table.
 *
 * andreinv(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (see source references)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';
import { InvertMatrix } from './tablinverse';
import { andre } from './Andre';

const cache = new Map<number, bigint[]>();

export function andreinv(n: number): bigint[] {
    const cached = cache.get(n);
    if (cached !== undefined) return cached;
    const m = Array.from({ length: n + 1 }, (_, i) => andre(i).slice(0, i + 1));
    const inv = InvertMatrix(m, true);
    const row = inv.length === 0 ? [] : inv[n];
    cache.set(n, row);
    return row;
}

export const AndreInv = new Table(
    andreinv,
    "AndreInv",
    ["A000000"],
    "",
    String.raw`%%`
);
