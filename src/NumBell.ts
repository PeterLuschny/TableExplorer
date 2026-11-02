/**
 * Provides the NumBell sequence.
 *
 * bell_num(n) computes the n-th term,
 * returned as a bigint.
 */
import { bell } from './Bell';

const numBellCache = new Map<number, bigint>();

export function bell_num(n: number): bigint {
    const cached = numBellCache.get(n);
    if (cached !== undefined) return cached;
    const v = n === 0 ? 1n : bell(n - 1)[n - 1];
    numBellCache.set(n, v);
    return v;
}
