/**
 * Provides the NumMotzkin sequence.
 *
 * motzkin_num(n) computes the n-th term,
 * returned as a bigint.
 */
import { motzkinpoly } from './MotzkinPoly';

const numMotzkinCache = new Map<number, bigint>();

export function motzkin_num(n: number): bigint {
    const cached = numMotzkinCache.get(n);
    if (cached !== undefined) return cached;
    const v = motzkinpoly(n).reduce((a, b) => a + b, 0n);
    numMotzkinCache.set(n, v);
    return v;
}
