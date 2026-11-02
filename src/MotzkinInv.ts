/**
 * Provides the MotzkinInv triangle as a Table.
 *
 * motzkininv(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const motzkinInvCache = new Map<number, bigint[]>();

export function motzkininv(n: number): bigint[] {
    const cached = motzkinInvCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [-1n, 1n];
    else {
        const r1 = motzkininv(n - 1);
        const r2 = motzkininv(n - 2);
        row = [-r1[0] - r2[0]];
        const lim = Math.min(r1.length, r1.length - 1, r2.length - 1);
        for (let i = 0; i < lim; i++) row.push(r1[i] - r1[i + 1] - r2[i + 1]);
        row.push(r1[r1.length - 2] - r1[r1.length - 1]);
        row.push(1n);
    }
    motzkinInvCache.set(n, row);
    return row;
}

export const MotzkinInv = new Table(
    motzkininv,
    "MotzkinInv",
    ["A104562", "A101950", "A344566"],
    "A064189",
    String.raw`\binom{n}{k} \text{Hyper}([(k-n)/2, (k-n+1)/2], [-n], 4)`
);
