/**
 * Provides the NumEulerPhi sequence.
 *
 * eulerphi(n) computes the n-th term,
 * returned as a bigint.
 */
import { Moebius } from './Moebius';

const numEulerPhiCache = new Map<number, bigint>();

export function eulerphi(n: number): bigint {
    const cached = numEulerPhiCache.get(n);
    if (cached !== undefined) return cached;
    const m = Moebius.row(n);
    let s = 0n;
    for (let k = 0; k <= n; k++) s += BigInt(k) * m[k];
    numEulerPhiCache.set(n, s);
    return s;
}
