/**
 * Provides the OrderedCycle triangle as a Table.
 *
 * orderedcycle(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const orderedCycleCache = new Map<number, bigint[]>();

export function orderedcycle(n: number): bigint[] {
    const cached = orderedCycleCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [0n, 1n];
    else {
        row = [...orderedcycle(n - 1), 0n];
        row[n] = row[n] * BigInt(n);
        for (let k = n; k > 0; k--) row[k] = BigInt(n - 1) * row[k] + BigInt(k) * row[k - 1];
    }
    orderedCycleCache.set(n, row);
    return row;
}

export const OrderedCycle = new Table(
    orderedcycle,
    "OrderedCycle",
    ["A225479", "A048594", "A075181"],
    "",
    String.raw`k! {n \brack k}`
);
