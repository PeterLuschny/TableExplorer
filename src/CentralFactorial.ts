/**
 * CentralFactorial triangle.
 *
 * [0] [1]
 * [1] [1,  1]
 * [2] [1,  4,     12]
 * [3] [1,  9,     72,       360]
 * [4] [1, 16,    240,      2880,      20160]
 * [5] [1, 25,    600,     12600,     201600,    1814400]
 * [6] [1, 36,   1260,     40320,    1088640,   21772800,  239500800]
 * [7] [1, 49,   2352,    105840,    4233600,  139708800, 3353011200, 43589145600]
 *
 * Row n is computed iteratively (no dependency on previous rows):
 *   T(n, 0) = 1
 *   T(n, k+1) = T(n, k) * (n² - k²)  for k = 0..n-1
 *
 * n² - k² is factored as (n-k)(n+k) to use two additions instead of
 * a multiply, a multiply, and a subtraction.
 *
 * References:
 *   OEIS: A370707
 */

import { Table } from './tabltypes';

const centralFactorialCache = new Map<number, bigint[]>();

function centralfactorial(n: number): bigint[] {
    if (n === 0) return [1n];

    const cached = centralFactorialCache.get(n);
    if (cached !== undefined) return cached;

    const row: bigint[] = new Array(n + 1).fill(1n);
    const nBig = BigInt(n);
    let kBig = 0n;
    for (let k = 0; k < n; k++, kBig++) {
        row[k + 1] = row[k] * (nBig - kBig) * (nBig + kBig);
    }

    centralFactorialCache.set(n, row);
    return row;
}

export const CentralFactorial = new Table(
    centralfactorial,
    "CentralFactorial",
    ["A370707"],
    "",
    String.raw`(-1)^k \prod_{j=0}^{k-1} (j - n)(j + n)`
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(CentralFactorial));
}
