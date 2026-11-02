/**
 * Provides the FiboLucasInv triangle as a Table.
 *
 * fibolucasinv(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const fiboLucasInvCache = new Map<number, bigint[]>();

export function fibolucasinv(n: number): bigint[] {
    const cached = fiboLucasInvCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [-2n, 1n];
    else {
        const prev = fibolucasinv(n - 1);
        row = new Array<bigint>(n + 1).fill(1n);
        row[n - 1] = -2n;
        for (let k = n - 2; k > 0; k--) row[k] = prev[k - 1] - prev[k + 1];
        row[0] = -2n * prev[0] - prev[1];
    }
    fiboLucasInvCache.set(n, row);
    return row;
}

export const FiboLucasInv = new Table(
    fibolucasinv,
    "FiboLucasInv",
    ["A375025"],
    "A000000",
    String.raw`%%`
);
