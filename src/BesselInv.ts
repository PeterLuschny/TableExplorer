/**
 * Provides the inverse Bessel triangle (unsigned) as a Table.
 *
 * besselinv(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: T(n, k) = (2k - n + 1) * T(n-1, k) + T(n-1, k-1)
 *
 * Triangle:
 * [0]  [1]
 * [1]  [0, 1]
 * [2]  [0, 1, 1]
 * [3]  [0, 0, 3,  1]
 * [4]  [0, 0, 3,  6,   1]
 * [5]  [0, 0, 0, 15,  10,   1]
 * [6]  [0, 0, 0, 15,  45,  15,    1]
 * [7]  [0, 0, 0,  0, 105, 105,   21,   1]
 * [8]  [0, 0, 0,  0, 105, 420,  210,  28,  1]
 * [9]  [0, 0, 0,  0,   0, 945, 1260, 378, 36, 1]
 *
 * References:
 *   OEIS: A122848, A104556, A096713
 *   Inverse: A132062
 */

import { Table } from './tabltypes';

const besselInvCache = new Map<number, bigint[]>();

export function besselinv(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = besselInvCache.get(n);
    if (cached !== undefined) return cached;

    const b = besselinv(n - 1);
    const mid = Array.from({ length: n - 1 }, (_, i) => {
        const k = i + 1;
        return BigInt(2 * k - n + 1) * b[k] + b[k - 1];
    });
    const result = [0n, ...mid, 1n];

    besselInvCache.set(n, result);
    return result;
}

export const BesselInv = new Table(
    besselinv,
    "BesselInv",
    ["A122848", "A104556", "A096713"],
    "A132062",
    String.raw`T(n,k)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(BesselInv));
}

