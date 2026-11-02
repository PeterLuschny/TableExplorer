/**
 * Provides the Andre triangle as a Table.
 *
 * andre(n) computes the n-th row of the triangle,
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

const absBigInt = (x: bigint): bigint => (x < 0n ? -x : x);

const key2 = (a: number, b: number): string => `${a},${b}`;

const andreInnerCache = new Map<string, bigint>();

function _andre(n: number, k: number): bigint {
    const key = key2(n, k);
    const cached = andreInnerCache.get(key);
    if (cached !== undefined) return cached;
    let value: bigint;
    if (k === 0 || n === 0) {
        value = 1n;
    } else {
        const brow = binomial(k);
        let s = 0n;
        for (let j = 0; j < k; j += n) {
            s += brow[j] * _andre(n, j);
        }
        value = -s;
    }
    andreInnerCache.set(key, value);
    return value;
}

const andreCache = new Map<number, bigint[]>();

export function andre(n: number): bigint[] {
    const cached = andreCache.get(n);
    if (cached !== undefined) return cached;
    const row = Array.from({ length: n + 1 }, (_, k) => absBigInt(_andre(k, n)));
    andreCache.set(n, row);
    return row;
}

export const Andre = new Table(
    andre,
    "Andre",
    ["A375555", "A181937"],
    "A000000",
    String.raw`-\sum_{j = 0 \text{ by } n }^{k-1} \binom{k}{j} T_{n, j}`
);
