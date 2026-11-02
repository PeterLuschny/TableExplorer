/**
 * Provides the inverse Catalan triangle (unsigned) as a Table.
 *
 * catalaninv(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: T(n, k) = T(n-1, k-1) + 2*T(n-1, k) - T(n-2, k)
 *
 * Triangle:
 * [0] [1]
 * [1] [0, 1]
 * [2] [0, 2, 1]
 * [3] [0, 3, 4, 1]
 * [4] [0, 4, 10, 6, 1]
 * [5] [0, 5, 20, 21, 8, 1]
 * [6] [0, 6, 35, 56, 36, 10, 1]
 * [7] [0, 7, 56, 126, 120, 55, 12, 1]
 * [8] [0, 8, 84, 252, 330, 220, 78, 14, 1]
 * [9] [0, 9, 120, 462, 792, 715, 364, 105, 16, 1]
 *
 * References:
 *   OEIS: A128908, A053122, A078812, A285072
 *   Inverse: A128899
 */

import { Table } from './tabltypes';

const catalanInvCache = new Map<number, bigint[]>();

function catalaninv(n: number): bigint[] {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];

    const cached = catalanInvCache.get(n);
    if (cached !== undefined) return cached;

    const c0 = [...catalaninv(n - 2), 0n, 0n];
    const c1 = [...catalaninv(n - 1), 0n];
    const mid = Array.from({ length: n }, (_, i) => c1[i] + 2n * c1[i + 1] - c0[i + 1]);
    const result = [0n, ...mid];

    catalanInvCache.set(n, result);
    return result;
}

export const CatalanInv = new Table(
    catalaninv,
    "CatalanInv",
    ["A128908", "A053122", "A078812", "A285072"],
    "A128899",
    String.raw`\binom{n+k-1}{2k-1}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(CatalanInv));
}
