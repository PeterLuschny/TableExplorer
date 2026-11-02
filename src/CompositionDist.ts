/**
 * Provides the CompositionDist triangle as a Table.
 *
 * compositiondist(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const key2 = (a: number, b: number): string => `${a},${b}`;

const compoDistCache = new Map<string, bigint>();

function _compodist(n: number, k: number): bigint {
    const key = key2(n, k);
    const cached = compoDistCache.get(key);
    if (cached !== undefined) return cached;
    let value: bigint;
    if (k < 0 || n < 0) value = 0n;
    else if (k === 0) value = n === 0 ? 1n : 0n;
    else value = _compodist(n - k, k) + BigInt(k) * _compodist(n - k, k - 1);
    compoDistCache.set(key, value);
    return value;
}

const compositionDistCache = new Map<number, bigint[]>();

export function compositiondist(n: number): bigint[] {
    const cached = compositionDistCache.get(n);
    if (cached !== undefined) return cached;
    const f = Math.floor((Math.sqrt(1 + 8 * n) - 1) / 2);
    const row = Array.from({ length: n + 1 }, (_, k) => (k <= f ? _compodist(n, k) : 0n));
    compositionDistCache.set(n, row);
    return row;
}

export const CompositionDist = new Table(
    compositiondist,
    "CompositionDist",
    ["A072574", "A216652"],
    "",
    String.raw`%%`
);
