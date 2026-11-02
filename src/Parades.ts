/**
 * Provides the Parades triangle as a Table.
 *
 * parades(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   [0] 1;
 *   [1] 0, 0;
 *   [2] 0, 1,  0;
 *   [3] 0, 1,  1,   0;
 *   [4] 0, 1,  5,   1,   0;
 *   [5] 0, 1, 13,  13,   1,  0;
 *   [6] 0, 1, 29,  73,  29,  1, 0;
 *   [7] 0, 1, 61, 301, 301, 61, 1, 0;
 *
 * References:
 *   OEIS: A371761, A272644
 */

import { Table } from './tabltypes';
import { binomial } from './Binomial';

const ACache = new Map<string, bigint>();

function A(n: number, k: number): bigint {
    if (n === 0) return k === 0 ? 1n : 0n;
    if (k > n) { [n, k] = [k, n]; }

    const key = `${n},${k}`;
    const cached = ACache.get(key);
    if (cached !== undefined) return cached;

    const b = binomial(k + 1);
    let s = 0n;
    for (let j = 1; j <= k; j++) {
        s += b[j + 1] * A(n - 1, k - j);
    }
    const result = s + BigInt(k) * A(n - 1, k);

    ACache.set(key, result);
    return result;
}

const paradesCache = new Map<number, bigint[]>();

export function parades(n: number): bigint[] {
    const cached = paradesCache.get(n);
    if (cached !== undefined) return cached;

    const half = Math.floor((n + 2) / 2);
    const row: bigint[] = [];
    for (let k = 0; k < half; k++) {
        row.push(A(n - k, k));
    }

    // n even:  row + reversed(row[:-1])  → mirrors around last element
    // n odd:   row + reversed(row)        → full palindrome
    const result = n % 2 === 0
        ? [...row, ...row.slice(0, -1).reverse()]
        : [...row, ...[...row].reverse()];

    paradesCache.set(n, result);
    return result;
}

export const Parades = new Table(
    parades,
    "Parades",
    ["A371761", "A272644"],
    "",
    String.raw`\sum_{j=0}^{k} \, {n - k \brace j} \, {k \brace j} \, (j!)^2`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Parades));
}
