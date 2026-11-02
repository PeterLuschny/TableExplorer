/**
 * Provides the PartitionDistSize triangle as a Table.
 *
 * partitiondistsize(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const key3 = (a: number, b: number, c: number): string => `${a},${b},${c}`;

const partDistSizeCache = new Map<string, bigint>();

function _partdistsize(n: number, k: number, r: number): bigint {
    const key = key3(n, k, r);
    const cached = partDistSizeCache.get(key);
    if (cached !== undefined) return cached;
    let value: bigint;
    if (n === 0) value = k === 0 ? 1n : 0n;
    else if (k === 0 || r === 0) value = 0n;
    else {
        let s = 0n;
        for (let j = 1; j <= Math.floor(n / r); j++) {
            s += _partdistsize(n - r * j, k - 1, r - 1);
        }
        value = s + _partdistsize(n, k, r - 1);
    }
    partDistSizeCache.set(key, value);
    return value;
}

const partitionDistSizeCache = new Map<number, bigint[]>();

export function partitiondistsize(n: number): bigint[] {
    const cached = partitionDistSizeCache.get(n);
    if (cached !== undefined) return cached;
    const f = Math.floor((Math.sqrt(1 + 8 * n) - 1) / 2);
    const row = Array.from({ length: n + 1 }, (_, k) => (k <= f ? _partdistsize(n, k, n) : 0n));
    partitionDistSizeCache.set(n, row);
    return row;
}

export const PartitionDistSize = new Table(
    partitiondistsize,
    "PartitionDistSize",
    ["A365676", "A116608", "A060177"],
    "",
    String.raw`[t^k][x^n] \prod_{j>=1} (1 + t \cdot x^j / (1 - x^j))`
);
