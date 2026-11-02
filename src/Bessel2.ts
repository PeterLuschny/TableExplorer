/**
 * Bessel2 triangle.
 *
 * [0] [1]
 * [1] [1,  0]
 * [2] [1,  0,   1]
 * [3] [1,  0,   3,    0]
 * [4] [1,  0,   6,    0,    3]
 * [5] [1,  0,  10,    0,   15,    0]
 * [6] [1,  0,  15,    0,   45,    0,    15]
 * [7] [1,  0,  21,    0,  105,    0,   105,    0]
 * [8] [1,  0,  28,    0,  210,    0,   420,    0,  105]
 * [9] [1,  0,  36,    0,  378,    0,  1260,    0,  945,  0]
 *
 * Recurrence: row = [...prev, 0], then
 *   if n is even: T(n, n) = T(n-1, n-2)   (otherwise stays 0)
 *   for k = 2, 4, ..., n-2:  T(n, k) = n * T(n-1, k) / (n - k)
 *
 * References:
 *   OEIS: A359760, A073278, A066325, A099174, A111924, A144299, A104556
 */

import { Table } from './tabltypes';

const bessel2Cache = new Map<number, bigint[]>();

function bessel2(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [1n, 0n];

    const cached = bessel2Cache.get(n);
    if (cached !== undefined) return cached;

    const row = [...bessel2(n - 1), 0n];

    // When n is even, the last element equals T(n-1, n-2); for odd n it stays 0.
    if (n % 2 === 0) row[n] = row[n - 2];

    // Update even interior entries. Pre-boxing n avoids repeated BigInt() calls.
    const nBig = BigInt(n);
    for (let k = 2; k < n; k += 2) {
        row[k] = (nBig * row[k]) / BigInt(n - k);
    }

    bessel2Cache.set(n, row);
    return row;
}

export const Bessel2 = new Table(
    bessel2,
    "Bessel2",
    ["A359760", "A073278", "A066325", "A099174", "A111924", "A144299", "A104556"],
    "",
    String.raw`\text{is}(k \text{ odd}) \, ? \, 0 : \binom{n}{k} \frac{k!}{2^{k/2} (k/2)!}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Bessel2));
}
