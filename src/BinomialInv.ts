/**
 * Inverse binomial (signed Pascal) triangle.
 *
 * T(n, k) = (-1)^(n-k) * C(n, k)
 *
 * [0]   1;
 * [1]  -1,    1;
 * [2]   1,   -2,    1;
 * [3]  -1,    3,   -3,    1;
 * [4]   1,   -4,    6,   -4,    1;
 * [5]  -1,    5,  -10,   10,   -5,    1;
 * [6]   1,   -6,   15,  -20,   15,   -6,    1;
 * [7]  -1,    7,  -21,   35,  -35,   21,   -7,    1;
 * [8]   1,   -8,   28,  -56,   70,  -56,   28,   -8,    1;
 * [9]  -1,    9,  -36,   84, -126,  126,  -84,   36,   -9,    1;
 */

import { Table } from './tabltypes';
import { binomial } from './Binomial';

export function binomialinv(n: number): bigint[] {
    return binomial(n).map((v, k) => (n - k) % 2 === 0 ? v : -v);
}

export const BinomialInv = new Table(
    binomialinv,
    "BinomialInv",
    ["A130595"],
    "A007318",
    String.raw`(-1)^{n-k} \, n! \, / (k! \, (n - k)! )`,
);