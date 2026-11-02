/**
 * Provides the Harmonic triangle as a Table.
 *
 * harmonic(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const harmonicCache = new Map<number, bigint[]>();

export function harmonic(n: number): bigint[] {
    const cached = harmonicCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [0n, 1n];
    else {
        row = [...harmonic(n - 1), 1n];
        const sav = row[1];
        for (let k = n - 1; k > 0; k--) row[k] = BigInt(n - 1) * row[k] + row[k - 1];
        row[1] += sav;
    }
    harmonicCache.set(n, row);
    return row;
}

export const Harmonic = new Table(
    harmonic,
    "Harmonic",
    ["A358694", "A109822"],
    "A000000",
    String.raw`T_{n - 1, k - 1} + (n - 1) T_{n - 1, k}; \ T_{n, 1} = n!`
);
