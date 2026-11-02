/**
 * Provides the One triangle as a Table.
 *
 * one(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const oneCache = new Map<number, bigint[]>();

export function one(n: number): bigint[] {
    const cached = oneCache.get(n);
    if (cached !== undefined) return cached;
    const row = n === 0 ? [1n] : [...one(n - 1), 1n];
    oneCache.set(n, row);
    return row;
}

export const One = new Table(
    one,
    "One",
    ["A000012", "A008836", "A014077"],
    "A167374",
    String.raw`1`
);
