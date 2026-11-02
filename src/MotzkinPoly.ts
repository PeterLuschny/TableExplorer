/**
 * Provides the MotzkinPoly triangle as a Table.
 *
 * motzkinpoly(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const motzkinPolyCache = new Map<number, bigint[]>();

export function motzkinpoly(n: number): bigint[] {
    const cached = motzkinPolyCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [1n, 0n];
    else {
        const h = n % 2 === 1 ? 0n : (motzkinpoly(n - 2)[n - 2] * 2n * BigInt(n - 1)) / BigInt(Math.floor(n / 2) + 1);
        row = [...motzkinpoly(n - 1), h];
        for (let k = 2; k < n; k += 2) row[k] = (BigInt(n) * row[k]) / BigInt(n - k);
    }
    motzkinPolyCache.set(n, row);
    return row;
}

export const MotzkinPoly = new Table(
    motzkinpoly,
    "MotzkinPoly",
    ["A359364"],
    "",
    String.raw`k \ \text{odd} \ ? \ 0 \ : \ \binom{n}{k} \text{Catalan}\left(\frac{k}{2}\right)`
);
