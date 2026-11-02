/**
 * Provides the NumEuler sequence.
 *
 * euler_num(n) computes the n-th term,
 * returned as a bigint.
 */
import { Euler } from './Euler';

const numEulerCache = new Map<number, bigint>();

export function euler_num(n: number): bigint {
    const cached = numEulerCache.get(n);
    if (cached !== undefined) return cached;
    const v = Euler.row(n)[0];
    numEulerCache.set(n, v);
    return v;
}
