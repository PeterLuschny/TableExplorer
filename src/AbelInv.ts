/**
 * Provides the AbelInv triangle as a Table.
 *
 * abelinv(n) computes the n-th row of the triangle,
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
import { Powers } from './Powers';

const abelinvCache = new Map<number, bigint[]>();

export function abelinv(n: number): bigint[] {
    const cached = abelinvCache.get(n);
    if (cached !== undefined) return cached;
    const b = binomial(n);
    const p = Powers.row(n);
    const row = Array.from({ length: n + 1 }, (_, k) => b[k] * p[k]);
    abelinvCache.set(n, row);
    return row;
}

export const AbelInv = new Table(
    abelinv,
    "AbelInv",
    ["A059297", "A059298"],
    "A137452",
    String.raw`\binom{n}{k} k^{n - k}`
);
