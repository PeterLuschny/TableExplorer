/**
 * Classes:
 *   Table: A class that provides methods for generating and manipulating integer triangles.
 *
 *   The class has the following parameters:
 *     gen:   A function gen(n) -> bigint[] that generates the n-th row (length n+1) of the table.
 *     id:    A string representing the name of the triangle.
 *     oeis:  A list of strings representing A-numbers of closely related OEIS triangles.
 *     invid: A string representing the ID of the inverse triangle.
 *     tex:   A TeX-string of the defining formula.
 *     invQ:  A boolean indicating whether the triangle is invertible.
 *
 *   The class provides the following methods:
 *     constructor(gen, id, oeis?, invid?, tex?)
 *     val(n, k): bigint
 *     itr(size): Generator<trow>
 *     tab(size): tabl
 *     mat(size): tabl
 *     row(n): trow
 *     rev(n): trow
 *     antidiag(n): trow
 *     alt(n): trow
 *     acc(n): trow
 *     diff(n): trow
 *     der(n): trow
 *     diag(n, size): trow
 *     col(k, size): trow
 *     sum(n): bigint
 *     flat(size): trow
 *     inv(size): tabl
 *     revinv(size): tabl
 *     invrev(size): tabl
 *     off(N, K): rowgen
 *     rev11(n): trow
 *     inv11(size): tabl
 *     revinv11(size): tabl
 *     invrev11(size): tabl
 *     poly(n, x): bigint
 *     trans(s, size): trow
 *     invtrans(s, size): trow
 *     show(size, total?): void
 *     showarray(size): void
 *
 * Type Aliases:
 *   trow:   bigint[] — a row of the triangle.
 *   tabl:   bigint[][] — a triangle (list of rows).
 *   seq:    (n: number) => bigint — an integer sequence.
 *   rowgen: (n: number) => trow — a row generator.
 *   tblgen: (n: number, k: number) => bigint — a triangle value function.
 *   Trait:  (T: Table, n: number) => trow — a trait function.
 *
 * Functions:
 *   RevTable(T): Table — new Table with reversed rows.
 *   AltTable(T): Table — new Table with alternating signs.
 *   SubTable(T, N, K): Table — sub-triangle rooted at (N, K).
 */

import { InvertMatrix } from './tablinverse';

// TABLE T ENUMERATED AS A TRIANGLE
// Is always (0,0)-based!
//
// T(0,0)
// T(1,0)  T(1,1)
// T(2,0)  T(2,1)  T(2,2)
// T(3,0)  T(3,1)  T(3,2)  T(3,3)
// T(4,0)  T(4,1)  T(4,2)  T(4,3)  T(4,4)
// T(5,0)  T(5,1)  T(5,2)  T(5,3)  T(5,4)  T(5,5)
//
// A subtriangle of the standard triangle T as indexed above
// is given by a new root node [N, K].
// For some dimension size > 0 it is defined as
// T[N, K, size] = [[T(n, k) for k in K .. N+n] for n in N .. N+size-1]
//
// Examples for the enumerations:
// row(4)     = [T(4,0), T(4,1), T(4,2), T(4,3), T(4,4)]
// col(2, 5)  = [T(2,2), T(3,2), T(4,2), T(5,2), T(6,2)]
// diag(2, 5) = [T(2,0), T(3,1), T(4,2), T(5,3), T(6,4)]

/** Type: row — a list of bigints of length n+1 for row index n. */
export type trow = bigint[];

/** Type: triangle — a list of rows. */
export type tabl = bigint[][];

/** Type: sequence — maps a non-negative integer index to a bigint. */
export type seq = (n: number) => bigint;

/** Type: row generator — gen(n) returns a trow of length n+1 for n >= 0. */
export type rowgen = (n: number) => trow;

/** Type: triangle generator — T(n, k) for 0 <= k <= n. */
export type tblgen = (n: number, k: number) => bigint;

/** Type: trait — a function from a Table and a size to a list of bigints. */
export type Trait = (T: Table, n: number) => trow;


/** Provides basic methods for manipulating integer triangles. */
export class Table {
    gen: rowgen;
    id: string;
    oeis: string[];
    invid: string;
    tex: string;
    invQ: boolean;

    /**
     * @param gen   Row generator: gen(n) returns bigint[] of length n+1 for n >= 0.
     * @param id    Name of the triangle.
     * @param oeis  A-numbers of closely related OEIS triangles.
     * @param invid Identifier of the inverse triangle (empty string if none).
     * @param tex   Defining formula as a TeX string.
     */
    constructor(
        gen: rowgen,
        id: string,
        oeis: string[] = [''],
        invid: string = '',
        tex: string = ''
    ) {
        this.gen = gen;
        this.id = id;
        this.oeis = oeis;
        this.invid = invid;
        this.tex = tex;
        this.invQ = invid !== '';
    }

    /**
     * Returns the n-th row of the triangle.
     * @throws {RangeError} if n < 0.
     */
    row(n: number): trow {
        if (n < 0) throw new RangeError('0 <= n expected');
        return this.gen(n);
    }

    /**
     * Returns the term T(n, k).
     * @throws {RangeError} if k > n, k < 0, or n < 0.
     */
    val(n: number, k: number): bigint {
        if (k > n || k < 0 || n < 0) throw new RangeError('0<=k<=n expected');
        return this.row(n)[k];
    }

    /**
     * Generator that yields the first `size` rows.
     * @example
     * for (const r of Abel.itr(5)) console.log(r);
     */
    *itr(size: number): Generator<trow> {
        for (let n = 0; n < size; n++) yield this.row(n);
    }

    /**
     * Returns the first `size` rows as an array.
     * @example Abel.tab(5) // [[1n],[0n,1n],[0n,2n,1n],...]
     */
    tab(size: number): tabl {
        return Array.from({ length: size }, (_, n) => [...this.row(n)]);
    }

    /**
     * Returns a size×size lower-triangular matrix (zeros above diagonal).
     * @example Abel.mat(5) // [[1n,0n,...],[0n,1n,0n,...],...]
     */
    mat(size: number): tabl {
        return Array.from({ length: size }, (_, n) =>
            Array.from({ length: size }, (_, k) => k <= n ? this.row(n)[k] : 0n)
        );
    }

    /**
     * Returns the n-th row reversed.
     * @example Abel.rev(4) // [1n,12n,48n,64n,0n]
     */
    rev(n: number): trow {
        return [...this.row(n)].reverse();
    }

    /**
     * Returns the n-th antidiagonal: [T(n,0), T(n-1,1), ..., T(ceil(n/2), floor(n/2))].
     * @example Motzkin.antidiag(4) // [9n,5n,1n]
     */
    antidiag(n: number): trow {
        const len = Math.floor((n + 2) / 2);
        return Array.from({ length: len }, (_, k) => this.row(n - k)[k]);
    }

    /**
     * Returns the n-th row with alternating signs: T(n,k) * (-1)^k.
     * @example Abel.alt(4) // [0n,-64n,48n,-12n,1n]
     */
    alt(n: number): trow {
        return this.row(n).map((term, k) => k % 2 === 0 ? term : -term);
    }

    /**
     * Returns the accumulated (prefix-sum) version of the n-th row.
     * @example Abel.acc(4) // [0n,64n,112n,124n,125n]
     */
    acc(n: number): trow {
        const result: bigint[] = [];
        let s = 0n;
        for (const v of this.row(n)) { s += v; result.push(s); }
        return result;
    }

    /**
     * Returns the first differences of the n-th row.
     * Satisfies: acc(diff(n)) == row(n).
     * @example Abel.diff(4) // [0n,64n,-16n,-36n,-11n]
     */
    diff(n: number): trow {
        const r = this.row(n);
        if (r.length === 0) return [];
        const result: bigint[] = [r[0]];
        for (let i = 1; i < r.length; i++) result.push(r[i] - r[i - 1]);
        return result;
    }

    /**
     * Returns the coefficients of the derivative of the n-th row polynomial.
     * der(n)[j] = T(n, j+1) * (j+1)
     * @example Abel.der(4) // [64n,96n,36n,4n]
     */
    der(n: number): trow {
        if (n === 0) return [0n];
        const coeffs = this.row(n);
        return Array.from({ length: n }, (_, j) => coeffs[j + 1] * BigInt(j + 1));
    }

    /**
     * Returns the n-th upward diagonal of length `size`: [T(n,0), T(n+1,1), ...].
     * @example Abel.diag(1, 5) // [0n,2n,6n,12n,20n]
     */
    diag(n: number, size: number): trow {
        return Array.from({ length: size }, (_, k) => this.row(n + k)[k]);
    }

    /**
     * Returns the k-th column of length `size` starting at the diagonal: [T(k,k), T(k+1,k), ...].
     * @example Abel.col(1, 5) // [1n,2n,9n,64n,625n]
     */
    col(k: number, size: number): trow {
        return Array.from({ length: size }, (_, n) => this.row(k + n)[k]);
    }

    /**
     * Returns the sum of the n-th row.
     * @example Abel.sum(4) // 125n
     */
    sum(n: number): bigint {
        return this.row(n).reduce((a, b) => a + b, 0n);
    }

    /**
     * Returns the triangle flattened into a single array (first `size` rows).
     * @example Abel.flat(5) // [1n,0n,1n,0n,2n,1n,...]
     */
    flat(size: number): trow {
        const result: bigint[] = [];
        for (let n = 0; n < size; n++) {
            const r = this.row(n);
            for (let k = 0; k <= n; k++) result.push(r[k]);
        }
        return result;
    }

    /**
     * Returns the matrix inverse of the first `size` rows, or [] if not invertible.
     * @example Abel.inv(4) // [[1n],[0n,1n],[0n,-2n,1n],[0n,3n,-6n,1n]]
     */
    inv(size: number): tabl {
        if (!this.invQ) return [];
        const M = Array.from({ length: size }, (_, n) => [...this.row(n)]);
        const V = InvertMatrix(M);
        if (V.length === 0) { this.invQ = false; return []; }
        return V;
    }

    /**
     * Returns the inverse table with each row reversed, or [] if not invertible.
     * @example Abel.revinv(4) // [[1n],[1n,0n],[1n,-2n,0n],[1n,-6n,3n,0n]]
     */
    revinv(size: number): tabl {
        const V = this.inv(size);
        if (V.length === 0) return [];
        return V.map((r, n) => Array.from({ length: n + 1 }, (_, k) => r[n - k]));
    }

    /**
     * Returns the inverse of the table formed by reversing each row, or [] if not invertible.
     * @example Abel.invrev(4) // []
     */
    invrev(size: number): tabl {
        const M = Array.from({ length: size }, (_, n) => [...this.row(n)].reverse());
        return InvertMatrix(M);
    }

    /**
     * Returns a row generator for the sub-triangle rooted at (N, K).
     * subgen(n) = row(n + N)[K .. N+n]
     * @example Abel.off(1,1)(3) // [64n,48n,12n,1n]
     */
    off(N: number, K: number): rowgen {
        return (n: number): trow => this.row(n + N).slice(K, N + n + 1);
    }

    /**
     * Returns the reversed n-th row of the sub-triangle with offset (1,1).
     * @example Abel.rev11(3) // [1n,12n,48n,64n]
     */
    rev11(n: number): trow {
        return [...this.off(1, 1)(n)].reverse();
    }

    /**
     * Returns the matrix inverse of the sub-triangle with offset (1,1), or [] if singular.
     * @example Abel.inv11(4) // [[1n],[-2n,1n],[3n,-6n,1n],[-4n,24n,-12n,1n]]
     */
    inv11(size: number): tabl {
        const M = Array.from({ length: size }, (_, n) => [...this.off(1, 1)(n)]);
        return InvertMatrix(M);
    }

    /**
     * Returns the inverse of the (1,1)-offset sub-table with rows reversed, or [].
     * @example Abel.revinv11(4) // [[1n],[1n,-2n],[1n,-6n,3n],[1n,-12n,24n,-4n]]
     */
    revinv11(size: number): tabl {
        return this.inv11(size).map(r => [...r].reverse());
    }

    /**
     * Returns the inverse of the reversed (1,1)-offset sub-table, or [].
     * @example Abel.invrev11(4) // []
     */
    invrev11(size: number): tabl {
        const M = Array.from({ length: size }, (_, n) => [...this.off(1, 1)(n)].reverse());
        return InvertMatrix(M);
    }

    /**
     * Evaluates the n-th row polynomial at x (coefficients in ascending power order).
     * Returns sum(T(n,k) * x^k for k=0..n).
     * @example Abel.poly(4, 2n) // 432n
     */
    poly(n: number, x: bigint): bigint {
        return this.row(n).reduce((acc, c, j) => acc + c * x ** BigInt(j), 0n);
    }

    /**
     * Binomial-transform-style: returns [sum(T(n,k)*s(k), k=0..n) for n=0..size-1].
     * @example Abel.trans(n => BigInt(n), 6) // [0n,1n,4n,24n,200n,2160n]
     */
    trans(s: seq, size: number): trow {
        return Array.from({ length: size }, (_, n) => {
            const r = this.row(n);
            let total = 0n;
            for (let k = 0; k <= n; k++) total += r[k] * s(k);
            return total;
        });
    }

    /**
     * Inverse binomial-transform-style:
     * returns [sum((-1)^(n-k)*T(n,k)*s(k), k=0..n) for n=0..size-1].
     * @example Abel.invtrans(n => BigInt(n*n), 6) // [0n,1n,2n,-6n,36n,-320n]
     */
    invtrans(s: seq, size: number): trow {
        return Array.from({ length: size }, (_, n) => {
            const r = this.row(n);
            let total = 0n;
            for (let k = 0; k <= n; k++) {
                const sign = (n - k) % 2 === 0 ? 1n : -1n;
                total += sign * r[k] * s(k);
            }
            return total;
        });
    }

    /**
     * Prints the first `size` rows, each prefixed with its index.
     * If total is true, also appends the row sum.
     * @example Abel.show(5, true)
     * // [0] [1n] [1n]
     * // [1] [0n, 1n] [1n]
     * // ...
     */
    show(size: number, total: boolean = false): void {
        for (let n = 0; n < size; n++) {
            const r = this.row(n);
            const rowSum = r.reduce((a, b) => a + b, 0n);
            console.log(`[${n}] [${r.join(', ')}]${total ? ` [${rowSum}]` : ''}`);
        }
    }

    /**
     * Prints the triangle read by upward antidiagonals (size columns per row).
     * @example Abel.showarray(5)
     * // [0] [1n, 1n, 1n, 1n, 1n]
     * // [1] [0n, 2n, 6n, 12n, 20n]
     * // ...
     */
    showarray(size: number): void {
        for (let n = 0; n < size; n++) {
            const d = this.diag(n, size);
            console.log(`[${n}] [${d.join(', ')}]`);
        }
    }
}


/**
 * Creates a new Table whose rows are the reversed rows of T.
 * The new table's id is T.id + ":Rev".
 */
export function RevTable(T: Table): Table {
    const cache = new Map<number, trow>();
    function revgen(n: number): trow {
        if (!cache.has(n)) cache.set(n, T.rev(n));
        return cache.get(n)!;
    }
    return new Table(revgen, T.id + ':Rev');
}

/**
 * Creates a new Table whose rows have alternating signs compared to T.
 * The new table's id is T.id + ":Alt".
 */
export function AltTable(T: Table): Table {
    const cache = new Map<number, trow>();
    function altgen(n: number): trow {
        if (!cache.has(n)) cache.set(n, T.alt(n));
        return cache.get(n)!;
    }
    return new Table(altgen, T.id + ':Alt');
}

/**
 * Creates a new Table representing the sub-triangle of T rooted at (N, K).
 * The new table's id is T.id + ":Off".
 */
export function SubTable(T: Table, N: number, K: number): Table {
    return new Table(T.off(N, K), T.id + ':Off');
}
