/**
 * Provides the LahInv triangle as a Table.
 *
 * lahinv(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';
import { Lah } from './Lah';

const lahInvCache = new Map<number, bigint[]>();

export function lahinv(n: number): bigint[] {
    const cached = lahInvCache.get(n);
    if (cached !== undefined) return cached;
    const row = Lah.row(n).map((v, k) => ((n - k) % 2 === 0 ? v : -v));
    lahInvCache.set(n, row);
    return row;
}

export const LahInv = new Table(
    lahinv,
    "LahInv",
    ["A111596", "A271703", "A008297", "A066667", "A089231", "A105278"],
    "A271703",
    String.raw`(-1)^{n-k} \binom{n}{k} \text{FallingFactorial}(n-1, n-k)`
);
