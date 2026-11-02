/**
 * Provides the EntringerSeidel triangle as a Table.
 *
 * entringerseidel(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';
import { entringer } from './Entringer';

const entringerSeidelCache = new Map<number, bigint[]>();

export function entringerseidel(n: number): bigint[] {
    const cached = entringerSeidelCache.get(n);
    if (cached !== undefined) return cached;
    const row = entringer(n);
    const out = n % 2 === 0 ? [...row].reverse() : [...row];
    entringerSeidelCache.set(n, out);
    return out;
}

export const EntringerSeidel = new Table(
    entringerseidel,
    "EntringerSeidel",
    ["A008280", "A108040", "A236935", "A239005"],
    "",
    String.raw`see \text{Entringer} and \text{Seidel} algorithms`
);
