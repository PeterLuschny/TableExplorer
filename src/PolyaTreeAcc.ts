/**
 * Provides the PolyaTreeAcc triangle as a Table.
 *
 * polyatreeacc(n) computes the n-th row of the triangle,
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

const polyaDivCache = new Map<number, number[]>();

function divisorsPolya(n: number): number[] {
    const cached = polyaDivCache.get(n);
    if (cached !== undefined) return cached;
    const row: number[] = [];
    for (let d = n; d >= 1; d--) if (n % d === 0) row.push(d);
    polyaDivCache.set(n, row);
    return row;
}

const polyaTCache = new Map<string, bigint>();

const polyaHCache = new Map<string, bigint>();

function _h(n: number, k: number): bigint {
    const key = key2(n, k);
    const cached = polyaHCache.get(key);
    if (cached !== undefined) return cached;
    let s = 0n;
    for (const d of divisorsPolya(n)) s += BigInt(d) * _T(d, k);
    polyaHCache.set(key, s);
    return s;
}

function _T(n: number, k: number): bigint {
    const key = key2(n, k);
    const cached = polyaTCache.get(key);
    if (cached !== undefined) return cached;
    let value: bigint;
    if (n === 1) value = k > 0 ? 1n : 0n;
    else {
        let s = 0n;
        for (let i = 1; i < n; i++) s += _T(i, k) * _h(n - i, k - 1);
        value = s / BigInt(n - 1);
    }
    polyaTCache.set(key, value);
    return value;
}

const polyaTreeAccCache = new Map<number, bigint[]>();

export function polyatreeacc(n: number): bigint[] {
    const cached = polyaTreeAccCache.get(n);
    if (cached !== undefined) return cached;
    if (n > 200) return [];
    const row = Array.from({ length: n + 1 }, (_, k) => _T(n + 1, k + 1));
    polyaTreeAccCache.set(n, row);
    return row;
}

export const PolyaTreeAcc = new Table(
    polyatreeacc,
    "PolyaTreeAcc",
    ["A375467"],
    "",
    String.raw`%%`
);
