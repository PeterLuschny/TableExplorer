/**
 * Provides the Lozanic triangle as a Table.
 *
 * lozanic(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';
import { binomial } from './Binomial';

const lozanicCache = new Map<number, bigint[]>();

export function lozanic(n: number): bigint[] {
    const cached = lozanicCache.get(n);
    if (cached !== undefined) return cached;
    let row: bigint[];
    if (n === 0) row = [1n];
    else {
        row = [1n, ...lozanic(n - 1)];
        for (let k = 1; k < n; k++) row[k] += row[k + 1];
        if (n % 2 === 0) {
            const b = binomial(n / 2 - 1);
            for (let k = 1; k < n; k += 2) row[k] -= b[(k - 1) / 2];
        }
    }
    lozanicCache.set(n, row);
    return row;
}

export const Lozanic = new Table(
    lozanic,
    "Lozanic",
    ["A034851"],
    "A000000",
    String.raw`\frac{1}{2} \left(\binom{n}{k}+\binom{n \text{ mod } 2}{k \text{ mod } 2} \binom{n \text{ div } 2}{k \text{ div } 2} \right)`
);
