/**
 * Provides the Euclid triangle as a Table.
 *
 * euclid(n) computes the n-th row of the triangle,
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

const euclidPairCache = new Map<string, bigint>();

function _euclid(n: number, k: number): bigint {
    const key = key2(n, k);
    const cached = euclidPairCache.get(key);
    if (cached !== undefined) return cached;
    let a = n;
    let b = k;
    while (b !== 0) {
        const t = b;
        b = a % b;
        a = t;
    }
    const value = a === 1 ? 1n : 0n;
    euclidPairCache.set(key, value);
    return value;
}

const euclidCache = new Map<number, bigint[]>();

export function euclid(n: number): bigint[] {
    const cached = euclidCache.get(n);
    if (cached !== undefined) return cached;
    const row = Array.from({ length: n + 1 }, (_, i) => _euclid(i, n));
    euclidCache.set(n, row);
    return row;
}

export const Euclid = new Table(
    euclid,
    "Euclid",
    ["A217831"],
    "",
    String.raw`is(k \text{ prime to } n ) \ ? \ 1 : 0`
);
