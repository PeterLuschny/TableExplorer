/**
 * Provides the Lehmer-Comtet triangle of the 2nd kind (unsigned) as a Table.
 *
 * lehmer(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * T(n, k) = 1                          if n = k
 *         = _t(k-1, n-k, n-k)          otherwise
 *
 * where _t(n, k, m) = m * _t(n, k-1, m) + _t(n-1, k, m+1),
 *       _t(*, 0, *) = 1,  _t(n<0, *, *) = _t(*, k<0, *) = 0
 *
 * This avoids the expensive x^(n-1) computation in the naive approach.
 *
 * Triangle:
 *   [0] 1;
 *   [1] 0,      1;
 *   [2] 0,      1,      1;
 *   [3] 0,      4,      3,      1;
 *   [4] 0,     27,     19,      6,     1;
 *   [5] 0,    256,    175,     55,    10,    1;
 *   [6] 0,   3125,   2101,    660,   125,   15,   1;
 *   [7] 0,  46656,  31031,   9751,  1890,  245,  21,  1;
 *   [8] 0, 823543, 543607, 170898, 33621, 4550, 434, 28, 1;
 *
 * References:
 *   OEIS: A354794, A039621
 */

import { Table } from './tabltypes';

const tCache = new Map<string, bigint>();

function _t(n: number, k: number, m: number): bigint {
    if (k < 0 || n < 0) return 0n;
    if (k === 0) return 1n;

    const key = `${n},${k},${m}`;
    const cached = tCache.get(key);
    if (cached !== undefined) return cached;

    const result = BigInt(m) * _t(n, k - 1, m) + _t(n - 1, k, m + 1);
    tCache.set(key, result);
    return result;
}

export function lehmer(n: number): bigint[] {
    if (n === 0) return [1n];
    return Array.from({length: n + 1}, (_, k) =>
        k === n ? 1n : _t(k - 1, n - k, n - k)
    );
}

export const Lehmer = new Table(
    lehmer,
    "Lehmer",
    ["A354794", "A039621"],
    "A000000",
    String.raw`is(n = k)\ ? \ 1 : \sum_{j=0}^{k-1} (-1)^{j}(n-j-1)^{n-1}/(j! (k-1-j)!)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Lehmer));
}
