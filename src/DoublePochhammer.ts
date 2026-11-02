/**
 * Provides the DoublePochhammer triangle as a Table.
 *
 * doublepochhammer(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const doublePochhammerCache = new Map<number, bigint[]>();

export function doublepochhammer(n: number): bigint[] {
    const cached = doublePochhammerCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [0n, 1n];
    else {
        row = [...doublepochhammer(n - 1), 1n];
        for (let k = n - 1; k > 0; k--) {
            row[k] = row[k - 1] + 2n * BigInt(n - 1) * row[k];
        }
    }
    doublePochhammerCache.set(n, row);
    return row;
}

export const DoublePochhammer = new Table(
    doublepochhammer,
    "DoublePochhammer",
    ["A039683"],
    "A00000",
    String.raw`[x^k]\, x(x-2)(x-4)...(x-2n+2)`
);
