/**
 * Provides the FiboLucas triangle as a Table.
 *
 * fibolucas(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const fiboLucasCache = new Map<number, bigint[]>();

export function fibolucas(n: number): bigint[] {
    const cached = fiboLucasCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [1n, 2n];
    else if (n === 2) row = [1n, 2n, 1n];
    else {
        const rowA = fibolucas(n - 2);
        row = [...fibolucas(n - 1), BigInt(1 + (n % 2))];
        row[2] += 1n;
        for (let k = 3; k < n; k++) row[k] += rowA[k - 2];
    }
    fiboLucasCache.set(n, row);
    return row;
}

export const FiboLucas = new Table(
    fibolucas,
    "FiboLucas",
    ["A374439"],
    "",
    String.raw`2^{k"} \, \binom{n - k" - (k - k") / 2}{(k - k") / 2} \text{ where } k' = k \text{ mod } 2`
);
