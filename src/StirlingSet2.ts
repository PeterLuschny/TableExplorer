/**
 * Provides the StirlingSet2 triangle as a Table.
 *
 * stirlingset2(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const stirlingSet2Cache = new Map<number, bigint[]>();

export function stirlingset2(n: number): bigint[] {
    const cached = stirlingSet2Cache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [0n, 0n];
    else {
        const rov = stirlingset2(n - 2);
        row = [...stirlingset2(n - 1), 0n];
        for (let k = 1; k <= Math.floor(n / 2); k++) row[k] = BigInt(n - 1) * rov[k - 1] + BigInt(k) * row[k];
    }
    stirlingSet2Cache.set(n, row);
    return row;
}

export const StirlingSet2 = new Table(
    stirlingset2,
    "StirlingSet2",
    ["A358623", "A008299", "A137375"],
    "",
    String.raw`\sum_{j=0}^{k} (-1)^{k-j} \binom{n}{k-j} {n-k+j \brace j}`
);
