/**
 * Provides the Möbius matrix as a Table.
 *
 * moebius(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * The matrix inverse of the Divisibility matrix.
 *
 * Triangle:
 * [0] 1
 * [1] 0,  1
 * [2] 0, -1,  1
 * [3] 0, -1,  0,  1
 * [4] 0,  0, -1,  0,  1
 * [5] 0, -1,  0,  0,  0, 1
 * [6] 0,  1, -1, -1,  0, 0, 1
 * [7] 0, -1,  0,  0,  0, 0, 0, 1
 * [8] 0,  0,  0,  0, -1, 0, 0, 0, 1
 * [9] 0,  0,  0, -1,  0, 0, 0, 0, 0, 1
 *
 * References:
 *   OEIS: A363914, A054525
 */

import { Table } from './tabltypes';
import { divisibility } from './Divisibility';

const moebiusValCache = new Map<number, bigint>();

function moebiusVal(n: number): bigint {
    if (n === 1) return 1n;
    if (n === 2) return -1n;

    const cached = moebiusValCache.get(n);
    if (cached !== undefined) return cached;

    const divRow = divisibility(n);
    let s = 0n;
    for (let k = 1; k < n - 1; k++) {
        if (divRow[k] !== 0n) s += moebiusVal(k);
    }
    const result = -s;
    moebiusValCache.set(n, result);
    return result;
}

function moebius(n: number): bigint[] {
    if (n === 0) return [1n];

    const row = new Array<bigint>(n + 1).fill(0n);
    row[n] = 1n;
    for (let k = 1; k < n; k++) {
        if (n % k === 0) {
            row[k] = moebiusVal(n / k);
        }
    }
    return row;
}

export const Moebius = new Table(
    moebius,
    "Moebius",
    ["A363914", "A054525"],
    "A000000",
    String.raw`M^{-1}(n, k); M(n, k) = [k \le n \ \& \ k | n]`,
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Moebius));
}
