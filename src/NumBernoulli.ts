/**
 * Provides the NumBernoulli sequence.
 *
 * Bernoulli(n) computes the n-th term,
 * returned as a Rational { num, den }.
 */
import { genocchi } from './Genocchi';

const absBigInt = (x: bigint): bigint => (x < 0n ? -x : x);

const gcdBigInt = (a: bigint, b: bigint): bigint => {
    let x = absBigInt(a);
    let y = absBigInt(b);
    while (y !== 0n) {
        const t = y;
        y = x % y;
        x = t;
    }
    return x;
};

interface Rational {
    num: bigint;
    den: bigint;
}

const numBernoulliCache = new Map<number, Rational>();

export function Bernoulli(n: number): Rational {
    const cached = numBernoulliCache.get(n);
    if (cached !== undefined) return cached;
    let out: Rational;
    if (n < 2) out = { num: 1n, den: BigInt(n + 1) };
    else if (n % 2 === 1) out = { num: 0n, den: 1n };
    else {
        const gRow = genocchi(Math.floor(n / 2) - 1);
        const g = gRow[gRow.length - 1];
        const den = (2n ** BigInt(n + 1)) - 2n;
        let num = g;
        if (n % 4 === 0) num = -num;
        const d0 = den < 0n ? -den : den;
        const n0 = den < 0n ? -num : num;
        const g0 = gcdBigInt(n0, d0);
        out = { num: n0 / g0, den: d0 / g0 };
    }
    numBernoulliCache.set(n, out);
    return out;
}
