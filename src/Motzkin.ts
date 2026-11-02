/**
 * Provides the Motzkin generating function triangle as a Table.
 *
 * motzkin(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Recurrence: T(n, k) = T(n-1, k) + T(n-1, k-1) + T(n-1, k+1)
 * (with out-of-bounds terms treated as 0), T(n, n) = 1.
 *
 * Triangle:
 * [0]    1;
 * [1]    1,    1;
 * [2]    2,    2,    1;
 * [3]    4,    5,    3,    1;
 * [4]    9,   12,    9,    4,   1;
 * [5]   21,   30,   25,   14,   5,   1;
 * [6]   51,   76,   69,   44,  20,   6,   1;
 * [7]  127,  196,  189,  133,  70,  27,   7,  1;
 * [8]  323,  512,  518,  392, 230, 104,  35,  8, 1;
 * [9]  835, 1353, 1422, 1140, 726, 369, 147, 44, 9, 1;
 *
 * References:
 *   OEIS: A064189, A026300, A009766, A122896
 */

import { Table } from './tabltypes';

const motzkinCache = new Map<number, bigint[]>();

export function motzkin(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = motzkinCache.get(n);
    if (cached !== undefined) return cached;

    const prev = motzkin(n - 1);
    const r   = [...prev, 0n];  // length n+1; r[n] = 0
    const row = [...prev, 1n];  // length n+1; row[n] = 1

    row[0] += r[1];
    for (let k = 1; k < n; k++) {
        row[k] += r[k - 1] + r[k + 1];
    }

    motzkinCache.set(n, row);
    return row;
}

export const Motzkin = new Table(
    motzkin,
    "Motzkin",
    ["A064189", "A026300", "A009766", "A122896"],
    "A000000",
    String.raw`\binom{n}{k} \text{Hyper}([(k-n)/2, (k-n+1)/2], [k+2], 4)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Motzkin));
}
