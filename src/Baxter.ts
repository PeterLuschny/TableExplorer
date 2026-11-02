/**
 * Provides the Baxter triangle as a Table.
 *
 * baxter(n) computes the n-th row of the triangle,
 * returned as a bigint[] of length n+1.
 *
 * Triangle:
 *   (no explicit sample block in python docstring)
 *
 * References:
 *   OEIS / inverse / formula: see Table declaration below.
 */
import { Table } from './tabltypes';

const baxterCache = new Map<number, bigint[]>();

export function baxter(n: number): bigint[] {
    const cached = baxterCache.get(n);
    if (cached !== undefined) return cached;
    if (n === 0) return [1n];
    const m = Math.floor((n - 1) / 2);
    const half: bigint[] = [1n];
    let t = 1n;
    for (let i = 0; i < m; i++) {
        const a = BigInt(n - 1 - i);
        const b = BigInt(n - i);
        const c = BigInt(n + 1 - i);
        const d = BigInt(1 + i);
        const e = BigInt(2 + i);
        const f = BigInt(3 + i);
        t = (t * a * b * c) / (d * e * f);
        half.push(t);
    }
    const interior = n % 2 === 1
        ? [...half, ...half.slice(0, -1).reverse()]
        : [...half, ...half.slice().reverse()];
    const row = [0n, ...interior];
    baxterCache.set(n, row);
    return row;
}

export const Baxter = new Table(
    baxter,
    "Baxter",
    ["A359363", "A056939"],
    "A000000",
    String.raw`x 	ext{Hyper}([-1 - n, -n, 1 - n], [2, 3], -x)`
);
