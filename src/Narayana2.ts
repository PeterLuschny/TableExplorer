/**
 * Provides the Narayana2 triangle as a Table.
 *
 * narayana2(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const narayana2Cache = new Map<number, bigint[]>();

export function narayana2(n: number): bigint[] {
    const cached = narayana2Cache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n < 3) row = [[1n], [0n, 1n], [0n, 1n, 1n]][n];
    else {
        const a = [...narayana2(n - 2), 0n, 0n];
        row = [...narayana2(n - 1), 1n];
        for (let k = n - 1; k > 1; k--) {
            row[k] = (
                ((row[k] + row[k - 1]) * BigInt(2 * n - 3))
                - ((a[k] - 2n * a[k - 1] + a[k - 2]) * BigInt(n - 3))
            ) / BigInt(n);
        }
    }
    narayana2Cache.set(n, row);
    return row;
}

export const Narayana2 = new Table(
    narayana2,
    "Narayana2",
    ["A352687"],
    "A000000",
    String.raw`(\binom{n}{k}^2 (k (2 k^2 + (n + 1) (n - 2 k)))) / (n^2 (n - 1) (n - k + 1))`
);
