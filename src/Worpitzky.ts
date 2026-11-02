/**
 * Worpitzky triangle.
 *
 * [0]  1;
 * [1]  1,   1;
 * [2]  1,   3,    2;
 * [3]  1,   7,   12,     6;
 * [4]  1,  15,   50,    60,     24;
 * [5]  1,  31,  180,   390,    360,    120;
 * [6]  1,  63,  602,  2100,   3360,   2520,    720;
 * [7]  1, 127, 1932, 10206,  25200,  31920,  20160,   5040;
 * [8]  1, 255, 6050, 46620, 166824, 317520, 332640, 181440, 40320;
 */

import { Table } from './tabltypes';

const worpitzkyCache = new Map<number, bigint[]>();

export function worpitzky(n: number): bigint[] {
    if (worpitzkyCache.has(n)) return worpitzkyCache.get(n)!;

    if (n === 0) {
        const result = [1n];
        worpitzkyCache.set(0, result);
        return result;
    }

    const row: bigint[] = [...worpitzky(n - 1), 0n];
    for (let k = n; k >= 1; k--) {
        row[k] = BigInt(k) * row[k - 1] + BigInt(k + 1) * row[k];
    }

    worpitzkyCache.set(n, row);
    return row;
}

export const Worpitzky = new Table(
    worpitzky,
    "Worpitzky",
    ["A028246", "A053440", "A075263", "A130850", "A163626"],
    "",
    String.raw`\sum_{j=0}^{n} \text{Eulerian}(n, j) \binom{n-j}{n-k}`,
);

if (require.main === module) {
    import('./Tests').then(({ TestTable }) => TestTable(Worpitzky));
}
