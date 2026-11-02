/**
 * Provides the LeibnizTable triangle as a Table.
 *
 * leibniztable(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const leibnizTableCache = new Map<number, bigint[]>();

export function leibniztable(n: number): bigint[] {
    const cached = leibnizTableCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [0n];
    else {
        const L = leibniztable(n - 1);
        row = Array.from({ length: n }, (_, k) => L[k] + BigInt(k)).concat(BigInt(n));
    }
    leibnizTableCache.set(n, row);
    return row;
}

export const LeibnizTable = new Table(
    leibniztable,
    "LeibnizTable",
    ["A003991"],
    "",
    String.raw`k\,(n - k + 1)`
);
