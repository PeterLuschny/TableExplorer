/**
 * Provides the Eulerian2 triangle as a Table.
 *
 * eulerian2(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const eulerian2Cache = new Map<number, bigint[]>();

export function eulerian2(n: number): bigint[] {
    const cached = eulerian2Cache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [0n, 1n];
    else {
        row = [...eulerian2(n - 1), 0n];
        for (let k = n; k > 1; k--) {
            row[k] = BigInt(2 * n - k) * row[k - 1] + BigInt(k) * row[k];
        }
    }
    eulerian2Cache.set(n, row);
    return row;
}

export const Eulerian2 = new Table(
    eulerian2,
    "Eulerian2",
    ["A340556", "A201637", "A008517", "A112007", "A163936"],
    "A000000",
    String.raw`k T(n - 1, k) + (2n - k) T(n - 1, k - 1)`
);
