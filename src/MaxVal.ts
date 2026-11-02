/**
 * Provides the MaxVal triangle as a Table.
 *
 * maxval(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const maxValPowRowCache = new Map<number, bigint[]>();

function _pow_row(n: number): bigint[] {
    const cached = maxValPowRowCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else {
        const prev = _pow_row(n - 1);
        row = Array.from({ length: n }, (_, k) => BigInt(k) * prev[k]).concat(BigInt(n) ** BigInt(n));
    }
    maxValPowRowCache.set(n, row);
    return row;
}

const maxValCache = new Map<number, bigint[]>();

export function maxval(n: number): bigint[] {
    const cached = maxValCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else {
        const pows = _pow_row(n);
        row = [0n, ...Array.from({ length: n }, (_, k) => pows[k + 1] - pows[k])];
    }
    maxValCache.set(n, row);
    return row;
}

export const MaxVal = new Table(
    maxval,
    "MaxVal",
    ["A199656"],
    "",
    String.raw`k^n - (k-1)^n`
);
