/**
 * Provides the CompositionAcc triangle as a Table.
 *
 * compositionacc(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';
import { compositionlp } from './CompositionLP';

const compositionAccCache = new Map<number, bigint[]>();

export function compositionacc(n: number): bigint[] {
    const cached = compositionAccCache.get(n);
    if (cached !== undefined) return cached;
    const row = compositionlp(n);
    const out: bigint[] = [];
    let s = 0n;
    for (const v of row) {
        s += v;
        out.push(s);
    }
    compositionAccCache.set(n, out);
    return out;
}

export const CompositionAcc = new Table(
    compositionacc,
    "CompositionAcc",
    ["A126198"],
    "",
    String.raw`\sum_{j=0}^k C_{LP}(n, j)`
);
