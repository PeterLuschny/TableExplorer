/**
 * Provides the EulerianB triangle as a Table.
 *
 * eulerianb(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const eulerianBCache = new Map<number, bigint[]>();

export function eulerianb(n: number): bigint[] {
    const cached = eulerianBCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else {
        row = [...eulerianb(n - 1), 1n];
        for (let k = n - 1; k > 0; k--) {
            row[k] = BigInt(2 * (n - k) + 1) * row[k - 1] + BigInt(2 * k + 1) * row[k];
        }
    }
    eulerianBCache.set(n, row);
    return row;
}

export const EulerianB = new Table(
    eulerianb,
    "EulerianB",
    ["A060187", "A138076"],
    "A000000",
    String.raw`T(n, k) = (2n - 2k + 1) \cdot T(n-1, k-1) + (2k - 1) \cdot T(n-1, k)`
);
