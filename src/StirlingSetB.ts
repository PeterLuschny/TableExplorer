/**
 * Provides the StirlingSetB triangle as a Table.
 *
 * stirlingsetb(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const stirlingSetBCache = new Map<number, bigint[]>();

export function stirlingsetb(n: number): bigint[] {
    const cached = stirlingSetBCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [1n, 1n];
    else {
        const prev = stirlingsetb(n - 1);
        row = [prev[0] + 2n * prev[1]];
        for (let i = 0; i < prev.length - 2; i++) {
            const k = i + 1;
            const a = prev[i];
            const c = prev[i + 1];
            const b = prev[i + 2];
            row.push(2n * BigInt(k + 1) * b + BigInt(2 * k + 1) * c + a);
        }
        row.push(BigInt(2 * n - 1) * prev[prev.length - 1] + prev[prev.length - 2]);
        row.push(1n);
    }
    stirlingSetBCache.set(n, row);
    return row;
}

export const StirlingSetB = new Table(
    stirlingsetb,
    "StirlingSetB",
    ["A154602"],
    "A000000",
    String.raw`\sum_{j=k}^{n} 2^{n-j} \binom{j}{k} {n \brace j}`
);
