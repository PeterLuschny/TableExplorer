/**
 * Provides the FussCatalan triangle as a Table.
 *
 * fusscatalan(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const fussCatalanCache = new Map<number, bigint[]>();

export function fusscatalan(n: number): bigint[] {
    const cached = fussCatalanCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [0n, 1n];
    else {
        const prev = fusscatalan(n - 1);
        row = [...prev, prev[n - 1]];
        let s = 0n;
        row = row.map((v) => {
            s += v;
            return s;
        });
    }
    fussCatalanCache.set(n, row);
    return row;
}

export const FussCatalan = new Table(
    fusscatalan,
    "FussCatalan",
    ["A355173", "A030237", "A054445"],
    "",
    String.raw`is(k=0) \, ? \, 0^n : \frac{(n - k + 2) (n + k - 1)!}{(n + 1)! \, (k - 1)!}`
);
