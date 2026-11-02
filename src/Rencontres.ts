/**
 * Rencontres triangle.
 *
 * [0]       1;
 * [1]       0,      1;
 * [2]       1,      0,     1;
 * [3]       2,      3,     0,     1;
 * [4]       9,      8,     6,     0,    1;
 * [5]      44,     45,    20,    10,    0,    1;
 * [6]     265,    264,   135,    40,   15,    0,   1;
 * [7]    1854,   1855,   924,   315,   70,   21,   0,  1;
 * [8]   14833,  14832,  7420,  2464,  630,  112,  28,  0, 1;
 * [9]  133496, 133497, 66744, 22260, 5544, 1134, 168, 36, 0, 1;
 */

import { Table } from './tabltypes';

const rencontresCache = new Map<number, bigint[]>();

export function rencontres(n: number): bigint[] {
    if (rencontresCache.has(n)) return rencontresCache.get(n)!;

    if (n === 0) {
        const result = [1n];
        rencontresCache.set(0, result);
        return result;
    }
    if (n === 1) {
        const result = [0n, 1n];
        rencontresCache.set(1, result);
        return result;
    }

    const prev1 = rencontres(n - 1);
    const prev2 = rencontres(n - 2);
    const row: bigint[] = [BigInt(n - 1) * (prev1[0] + prev2[0]), ...prev1];
    for (let k = 1; k < n - 1; k++) {
        row[k] = (BigInt(n) * row[k]) / BigInt(k);
    }

    rencontresCache.set(n, row);
    return row;
}

export const Rencontres = new Table(
    rencontres,
    "Rencontres",
    ["A008290", "A098825"],
    "A055137",
    String.raw`\binom{n}{k} \operatorname{derangements}(n - k)`,
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Rencontres));
}
