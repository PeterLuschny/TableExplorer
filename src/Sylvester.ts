/**
 * Provides the Sylvester triangle as a Table.
 *
 * sylvester(n) computes the n-th row of the triangle,
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
import { StirlingCycle } from './StirlingCycle';

const sylvesterCache = new Map<number, bigint[]>();

export function sylvester(n: number): bigint[] {
    const cached = sylvesterCache.get(n);
    if (cached !== undefined) return cached;
    const row = Array.from({ length: n + 1 }, (_, k) => {
        let s = 0n;
        for (let j = 0; j <= k; j++) s += binomial(n)[k - j] * StirlingCycle.val(n - k + j, j);
        return s;
    });
    sylvesterCache.set(n, row);
    return row;
}

export const Sylvester = new Table(
    sylvester,
    "Sylvester",
    ["A341101"],
    "",
    String.raw`\sum_{j=0}^{k} (-1)^{n-k} \binom{n}{k-j} {n - k + j \brack j}`
);
