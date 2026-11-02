/**
 * Provides the NumDivisors sequence.
 *
 * divisors_num(n) computes the n-th term,
 * returned as a bigint.
 */
import { divisibility } from './Divisibility';

const numDivisorsCache = new Map<number, bigint>();

export function divisors_num(n: number): bigint {
    const cached = numDivisorsCache.get(n);
    if (cached !== undefined) return cached;
    const v = divisibility(n).reduce((a, b) => a + b, 0n);
    numDivisorsCache.set(n, v);
    return v;
}
