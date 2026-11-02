/**
 * Provides the Polygonal triangle as a Table.
 *
 * polygonal(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const polygonalCache = new Map<number, bigint[]>();

export function polygonal(n: number): bigint[] {
    const cached = polygonalCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [0n];
    else if (n === 1) row = [0n, 1n];
    else {
        const rov = polygonal(n - 2);
        row = [...polygonal(n - 1), BigInt(n)];
        row[n - 1] += row[n - 2];
        for (let k = 2; k < n - 1; k++) row[k] += row[k] - rov[k];
    }
    polygonalCache.set(n, row);
    return row;
}

export const Polygonal = new Table(
    polygonal,
    "Polygonal",
    ["A139600", "A057145", "A134394", "A139601"],
    "",
    String.raw`k + \frac{1}{2}\, n\, k\, (k-1)`
);
