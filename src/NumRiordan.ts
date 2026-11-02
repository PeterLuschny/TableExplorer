/**
 * Provides the NumRiordan sequence.
 *
 * riordan_num(n) computes the n-th term,
 * returned as a bigint.
 */
import { BinomialCatalan } from './BinomialCatalan';

const numRiordanCache = new Map<number, bigint>();

export function riordan_num(n: number): bigint {
    const cached = numRiordanCache.get(n);
    if (cached !== undefined) return cached;
    let s = 0n;
    for (let k = 0; k <= n; k++) {
        const sign = ((n - k) & 1) === 0 ? 1n : -1n;
        s += sign * BinomialCatalan.val(n, k);
    }
    numRiordanCache.set(n, s);
    return s;
}
