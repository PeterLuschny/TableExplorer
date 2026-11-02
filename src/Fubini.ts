/**
 * Provides the Fubini triangle (ordered set partitions) as a Table.
 *
 * fubini(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * T(n, k) = k! * S(n, k)   where S(n, k) is the Stirling set number.
 * Recurrence: T(n, k) = k * (T(n-1, k-1) + T(n-1, k))
 *
 * Triangle:
 * [0]  1
 * [1]  0,   1
 * [2]  0,   1,     2
 * [3]  0,   1,     6,      6
 * [4]  0,   1,    14,     36,     24
 * [5]  0,   1,    30,    150,    240,    120
 * [6]  0,   1,    62,    540,   1560,   1800,    720
 * [7]  0,   1,   126,   1806,   8400,  16800,  15120,   5040
 * [8]  0,   1,   254,   5796,  40824, 126000, 191520, 141120, 40320
 *
 * References:
 *   OEIS: A131689, A019538, A090582, A278075
 */

import { Table } from './tabltypes';

const fubiniCache = new Map<number, bigint[]>();

function fubini(n: number): bigint[] {
    if (fubiniCache.has(n)) return fubiniCache.get(n)!;

    if (n === 0) {
        fubiniCache.set(0, [1n]);
        return [1n];
    }

    const prev = fubini(n - 1);
    const r = (k: number): bigint => (k <= n - 1 ? prev[k] : 0n);

    const row = [0n, ...prev];  // prepend 0, so row[k] = prev[k-1] initially
    for (let k = 1; k <= n; k++) {
        row[k] = BigInt(k) * (r(k - 1) + r(k));
    }

    fubiniCache.set(n, row);
    return row;
}

export const Fubini = new Table(
    fubini,
    "Fubini",
    ["A131689", "A019538", "A090582", "A278075"],
    "",
    String.raw`k! \ {n \brace k}`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Fubini));
}


