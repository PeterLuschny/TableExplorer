/**
 * Provides the Levin triangle as a Table.
 *
 * levin(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const levinCache = new Map<number, bigint[]>();

export function levin(n: number): bigint[] {
    const cached = levinCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else {
        row = [...levin(n - 1), 1n];
        row[0] = row[n] = (row[n - 1] * BigInt(4 * n - 2)) / BigInt(n);
        for (let k = 1; k < n; k++) {
            row[k] = (BigInt(n - k + 1) * row[k - 1]) / BigInt(k);
        }
    }
    levinCache.set(n, row);
    return row;
}

export const Levin = new Table(
    levin,
    "Levin",
    ["A356546"],
    "",
    String.raw`\binom{2n}{n} \ \binom{n}{k}`
);
