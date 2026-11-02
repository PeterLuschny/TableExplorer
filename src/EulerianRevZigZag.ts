/**
 * Provides the EulerianRevZigZag triangle as a Table.
 *
 * eulerianrevzigzag(n) computes the n-th row of the triangle,
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

const key2 = (a: number, b: number): string => `${a},${b}`;

const sRevZigCache = new Map<string, bigint>();

function _sRevZig(n: number, k: number): bigint {
    const key = key2(n, k);
    const cached = sRevZigCache.get(key);
    if (cached !== undefined) return cached;
    let value: bigint;
    if (k === 0) value = 1n;
    else {
        let s = _sRevZig(n, k - 1);
        for (let j = 0; j <= Math.floor((n - 1) / 2); j++) {
            s += _sRevZig(2 * j, k - 1) * _sRevZig(n - 1 - 2 * j, k);
        }
        value = s;
    }
    sRevZigCache.set(key, value);
    return value;
}

const eulerianRevZigZagCache = new Map<number, bigint[]>();

export function eulerianrevzigzag(n: number): bigint[] {
    const cached = eulerianRevZigZagCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else if (n === 1) row = [0n, 1n];
    else {
        const b = Array.from({ length: n + 1 }, (_, j) => ((j & 1) === 1 ? -1n : 1n) * binomial(n + 1)[j]);
        const r = Array.from({ length: n - 1 }, (_, k) => {
            let s = 0n;
            for (let j = 0; j <= k; j++) s += b[j] * _sRevZig(n, k - j);
            return s;
        });
        row = [0n, 0n, ...r];
    }
    eulerianRevZigZagCache.set(n, row);
    return row;
}

export const EulerianRevZigZag = new Table(
    eulerianrevzigzag,
    "EulerianRevZigZag",
    ["A205497"],
    "A000000",
    String.raw`%%`
);
