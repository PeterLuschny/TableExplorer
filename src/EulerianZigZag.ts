/**
 * Provides the EulerianZigZag triangle as a Table.
 *
 * eulerianzigzag(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';
import { binomial } from './Binomial';
import { degsympoly } from './DegSymPoly';

const eulerianZigZagCache = new Map<number, bigint[]>();

export function eulerianzigzag(n: number): bigint[] {
    const cached = eulerianZigZagCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [1n, 1n];
    else {
        const half = Math.floor((n + 2) / 2);
        const b = binomial(n + 3);
        const d = degsympoly(n + 2);
        const h = Array.from({ length: half }, (_, k) => {
            let s = 0n;
            for (let j = 0; j <= k; j++) {
                s += ((j & 1) === 1 ? -1n : 1n) * b[j] * d[k - j];
            }
            return s;
        });
        row = n % 2 === 0 ? [...h, ...h.slice(0, -1).reverse()] : [...h, ...h.slice().reverse()];
    }
    eulerianZigZagCache.set(n, row);
    return row;
}

export const EulerianZigZag = new Table(
    eulerianzigzag,
    "EulerianZigZag",
    ["A205497"],
    "",
    String.raw`\mid \sum_{j=0..n} \binom{k}{j} \text{Euler}(n - k + j) \mid`
);
