/**
 * Provides the Pascal triangle as a Table.
 *
 * pascal(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const pascalCache = new Map<number, bigint[]>();

export function pascal(n: number): bigint[] {
    const cached = pascalCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else {
        row = [1n, ...pascal(n - 1)];
        for (let k = 1; k < n; k++) row[k] += row[k + 1];
    }
    pascalCache.set(n, row);
    return row;
}

export const Pascal = new Table(
    pascal,
    "Pascal",
    ["A007318", "A074909", "A108086", "A117440", "A118433", "A130595", "A135278", "A154926"],
    "A000000",
    String.raw`\binom{n}{k}`
);
