/**
 * Provides the HyperHarmonic triangle as a Table.
 *
 * hyperharmonic(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const hyperHarmonicCache = new Map<number, bigint[]>();

export function hyperharmonic(n: number): bigint[] {
    const cached = hyperHarmonicCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else {
        row = [...hyperharmonic(n - 1), 1n];
        for (let m = n - 1; m > 0; m--) {
            row[m] = BigInt(n - m + 1) * row[m] + row[m - 1];
        }
        row[0] *= BigInt(n);
    }
    hyperHarmonicCache.set(n, row);
    return row;
}

export const HyperHarmonic = new Table(
    hyperharmonic,
    "HyperHarmonic",
    ["A165675", "A093905", "A105954", "A165674"],
    "A000000",
    String.raw`(n - k + 1)! \ \text{HyperHarmonic}(k, n - k)`
);
