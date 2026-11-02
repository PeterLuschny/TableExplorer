/**
 * Provides the NumPartLists sequence.
 *
 * partlist_num(n) computes the n-th term,
 * returned as a bigint.
 */
import { Lah } from './Lah';

const numPartListsCache = new Map<number, bigint>();

export function partlist_num(n: number): bigint {
    const cached = numPartListsCache.get(n);
    if (cached !== undefined) return cached;
    const v = Lah.row(n).reduce((a, b) => a + b, 0n);
    numPartListsCache.set(n, v);
    return v;
}
