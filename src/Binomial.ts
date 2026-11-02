/**
 * Pascal triangle, binomial coefficients.
 *
 * [0]   1;
 * [1]   1,   1;
 * [2]   1,   2,   1;
 * [3]   1,   3,   3,   1;
 * [4]   1,   4,   6,   4,   1;
 * [5]   1,   5,  10,  10,   5,   1;
 * [6]   1,   6,  15,  20,  15,   6,   1;
 * [7]   1,   7,  21,  35,  35,  21,   7,   1;
 * [8]   1,   8,  28,  56,  70,  56,  28,   8,   1;
 * [9]   1,   9,  36,  84, 126, 126,  84,  36,   9,   1;
 */

import { Table } from './tabltypes';

const binomialCache = new Map<number, bigint[]>();

export function binomial(n: number): bigint[] {
    if (binomialCache.has(n)) return binomialCache.get(n)!;

    if (n === 0) {
        const result = [1n];
        binomialCache.set(0, result);
        return result;
    }

    const row: bigint[] = [1n, ...binomial(n - 1)];
    for (let k = 1; k < n; k++) {
        row[k] += row[k + 1];
    }

    binomialCache.set(n, row);
    return row;
}

export const Binomial = new Table(
    binomial,
    "Binomial",
    [
        "A007318", "A074909", "A108086", "A117440",
        "A118433", "A130595", "A135278", "A154926",
    ],
    "A130595",
    String.raw`n! \, / (k! \, (n - k)! )`,
);

