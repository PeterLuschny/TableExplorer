/**
 * Provides the Template triangle as a Table.
 *
 * template(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const templateCache = new Map<number, bigint[]>();

export function template(n: number): bigint[] {
    const cached = templateCache.get(n);
    if (cached !== undefined) return cached;
    const row = n === 0 ? [0n] : new Array<bigint>(n + 1).fill(0n);
    templateCache.set(n, row);
    return row;
}

export const Template = new Table(
    template,
    "Template",
    ["A000004"],
    "",
    String.raw`T(n,k)=0`
);
