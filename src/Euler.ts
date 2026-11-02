/**
 * Provides the Euler triangle as a Table.
 *
 * euler(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 * [0]     1
 * [1]    -1      1
 * [2]     1     -2      1
 * [3]    -2      3     -3      1
 * [4]     5     -8      6     -4      1
 * [5]   -16     25    -20     10     -5     1
 * [6]    61    -96     75    -40     15    -6     1
 * [7]  -272    427   -336    175    -70    21    -7    1
 * [8]  1385  -2176   1708   -896    350  -112    28   -8   1
 * [9] -7936  12465  -9792   5124  -2016   630  -168   36  -9   1
 *
 * References:
 *   OEIS: A363394, A247453, A109449
 */

import { Table } from './tabltypes';

const eulerCache = new Map<number, bigint[]>();

export function euler(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = eulerCache.get(n);
    if (cached !== undefined) return cached;

    const row = [...euler(n - 1), 1n];
    const N = BigInt(n);
    for (let k = n; k > 0; k--) {
        row[k] = (row[k - 1] * N) / BigInt(k);
    }
    let a = 0n, b = 0n;
    for (let j = n; j > 0; j -= 4) a += row[j];
    for (let j = n - 2; j > 0; j -= 4) b += row[j];
    row[0] = (n >> 1) % 2 === 0 ? b - a : a - b;

    eulerCache.set(n, row);
    return row;
}

export const Euler = new Table(
    euler,
    "Euler",
    ["A363394", "A247453", "A109449"],
    "A000000",
    String.raw`\binom{n}{k} 2^{n-k} \text{Euler}_{n-k}(1/2)`,
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Euler));
}
