/**
 * Catalan paths triangle.
 *
 * [0]   1,
 * [1]   0,   1,
 * [2]   1,   0,   1,
 * [3]   0,   2,   0,   1,
 * [4]   2,   0,   3,   0,   1,
 * [5]   0,   5,   0,   4,   0,   1,
 * [6]   5,   0,   9,   0,   5,   0,   1,
 * [7]   0,  14,   0,  14,   0,   6,   0,  1,
 * [8]  14,   0,  28,   0,  20,   0,   7,  0,  1,
 * [9]   0,  42,   0,  48,   0,  27,   0,  8,  0,  1.
 */

import { Table } from './tabltypes';

const catalanPathsCache = new Map<number, bigint[]>();

function catalanpaths(n: number): bigint[] {
    if (catalanPathsCache.has(n)) return catalanPathsCache.get(n)!;

    if (n === 0) {
        const result = [1n];
        catalanPathsCache.set(0, result);
        return result;
    }

    const prev = catalanpaths(n - 1);
    const r = (k: number): bigint => (k >= 0 && k < n) ? prev[k] : 0n;

    const row: bigint[] = [...prev, 1n];
    for (let k = 0; k < n; k++) {
        row[k] = r(k - 1) + r(k + 1);
    }

    catalanPathsCache.set(n, row);
    return row;
}

export const CatalanPaths = new Table(
    catalanpaths,
    "CatalanPaths",
    ["A053121", "A052173", "A112554", "A322378"],
    "A049310",
    String.raw`\operatorname{is}(k = 0)\ ?\ 0 : \frac{k+1}{n+1} \binom{n+1}{(n-k)/2}`,
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(CatalanPaths));
}
