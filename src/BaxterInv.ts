/**
 * Provides the BaxterInv triangle as a Table.
 *
 * baxterinv(n) computes the n-th row of the triangle,
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
import { baxter } from './Baxter';

const cache = new Map<number, bigint[]>();

export function baxterinv(n: number): bigint[] {
    const cached = cache.get(n);
    if (cached !== undefined) return cached;
    const m = Array.from({ length: n + 1 }, (_, i) => baxter(i).slice(0, i + 1));
    const inv = InvertMatrix(m, true);
    const row = inv.length === 0 ? [] : inv[n];
    cache.set(n, row);
    return row;
}

export const BaxterInv = new Table(
    baxterinv,
    "BaxterInv",
    ["A000000"],
    "",
    String.raw`%%`
);
