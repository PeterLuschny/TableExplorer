/**
 * Provides the StirlingCycle2 triangle as a Table.
 *
 * stirlingcycle2(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const stirlingCycle2Cache = new Map<number, bigint[]>();

export function stirlingcycle2(n: number): bigint[] {
    const cached = stirlingCycle2Cache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [0n, 0n];
    else {
        const rov = stirlingcycle2(n - 2);
        row = [...stirlingcycle2(n - 1), 0n];
        for (let k = 1; k <= Math.floor(n / 2); k++) row[k] = BigInt(n - 1) * (rov[k - 1] + row[k]);
    }
    stirlingCycle2Cache.set(n, row);
    return row;
}

export const StirlingCycle2 = new Table(
    stirlingcycle2,
    "StirlingCycle2",
    ["A358622", "A008306", "A106828"],
    "",
    String.raw`n! [z^k][t^n] (\exp(t) (1 - t))^{-z}`
);
