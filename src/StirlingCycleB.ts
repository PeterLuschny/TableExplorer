/**
 * Provides the StirlingCycleB triangle as a Table.
 *
 * stirlingcycleb(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const stirlingCycleBCache = new Map<number, bigint[]>();

export function stirlingcycleb(n: number): bigint[] {
    const cached = stirlingCycleBCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else {
        row = [...stirlingcycleb(n - 1), 1n];
        const m = BigInt(2 * n - 1);
        for (let k = n - 1; k > 0; k--) row[k] = m * row[k] + row[k - 1];
        row[0] *= m;
    }
    stirlingCycleBCache.set(n, row);
    return row;
}

export const StirlingCycleB = new Table(
    stirlingcycleb,
    "StirlingCycleB",
    ["A028338", "A039757", "A039758", "A109692"],
    "A000000",
    String.raw`\sum_{i=k}^{n} (-2)^{n-i} \binom{i}{k} {n \brack i}`
);
