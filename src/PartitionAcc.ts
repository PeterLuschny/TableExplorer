/**
 * Provides the PartitionAcc triangle as a Table.
 *
 * partitionacc(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';
import { Partition } from './Partition';

const partitionAccCache = new Map<number, bigint[]>();

export function partitionacc(n: number): bigint[] {
    const cached = partitionAccCache.get(n);
    if (cached !== undefined) return cached;
    const p = Partition.row(n);
    const row: bigint[] = [];
    let s = 0n;
    for (const v of p) {
        s += v;
        row.push(s);
    }
    partitionAccCache.set(n, row);
    return row;
}

export const PartitionAcc = new Table(
    partitionacc,
    "PartitionAcc",
    ["A026820", "A058400"],
    "",
    String.raw`T(n, k-1) + (is(k > n) ? 0 : T(n-k, k))`
);
