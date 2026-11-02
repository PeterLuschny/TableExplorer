/**
 * Provides the PartitionDist triangle as a Table.
 *
 * partitiondist(n) computes the n-th row of the triangle,
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

const partDistCache = new Map<string, bigint>();

function _partdist(n: number, k: number): bigint {
    const key = key2(n, k);
    const cached = partDistCache.get(key);
    if (cached !== undefined) return cached;
    let value: bigint;
    if (k < 1 || n < k) value = 0n;
    else if (n === 1) value = 1n;
    else value = _partdist(n - k, k) + _partdist(n - k, k - 1);
    partDistCache.set(key, value);
    return value;
}

const partitionDistCache = new Map<number, bigint[]>();

export function partitiondist(n: number): bigint[] {
    const cached = partitionDistCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else {
        const f = Math.floor((Math.sqrt(1 + 8 * n) - 1) / 2);
        row = Array.from({ length: n + 1 }, (_, k) => (k <= f ? _partdist(n, k) : 0n));
    }
    partitionDistCache.set(n, row);
    return row;
}

export const PartitionDist = new Table(
    partitiondist,
    "PartitionDist",
    ["A008289"],
    "",
    String.raw`%%`
);
