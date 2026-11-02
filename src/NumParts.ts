/**
 * Provides the NumParts sequence.
 *
 * part_num(n) computes the n-th term,
 * returned as a bigint.
 */
import { Partition } from './Partition';

const numPartsCache = new Map<number, bigint>();

export function part_num(n: number): bigint {
    const cached = numPartsCache.get(n);
    if (cached !== undefined) return cached;
    const v = Partition.row(n).reduce((a, b) => a + b, 0n);
    numPartsCache.set(n, v);
    return v;
}
