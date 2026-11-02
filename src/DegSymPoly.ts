/**
 * Provides the DegSymPoly triangle as a Table.
 *
 * degsympoly(n) computes the n-th row of the triangle,
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

const sCache = new Map<string, bigint>();

function _S(n: number, k: number): bigint {
    const key = key2(n, k);
    const cached = sCache.get(key);
    if (cached !== undefined) return cached;
    let value: bigint;
    if (k <= 0) value = 1n;
    else {
        let s = _S(n, k - 1);
        for (let j = 0; j <= Math.floor((n - 1) / 2); j++) {
            s += _S(2 * j, k - 1) * _S(n - 1 - 2 * j, k);
        }
        value = s;
    }
    sCache.set(key, value);
    return value;
}

const degSymPolyCache = new Map<number, bigint[]>();

export function degsympoly(n: number): bigint[] {
    const cached = degSymPolyCache.get(n);
    if (cached !== undefined) return cached;
    const row = Array.from({ length: n + 1 }, (_, k) => _S(n, k));
    degSymPolyCache.set(n, row);
    return row;
}

export const DegSymPoly = new Table(
    degsympoly,
    "DegSymPoly",
    ["A394080", "A050446", "A050447"],
    "",
    String.raw`T(n, k - 1 ) + \sum_{j = 0}^{\lfloor \frac{n-1}{2} \rfloor} T(2 j, k - 1) T(n - 1 - 2 j, k)`
);
