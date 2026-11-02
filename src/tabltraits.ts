/**
 * Various functions to analyze and transform integer triangles (Table objects).
 * Includes trait functions such as dot products, polynomial evaluations, column/diagonal
 * extractors, row aggregates, transforms, convolutions, and their Rev* variants.
 */

 /**
Key translation decisions:

lcm/gcd: Euclidean algorithm implemented inline as bigint functions.
accumulate(seq) (Python prefix-sum) → inline prefixSumTotal() helper.
reduce(max, ...) → inline .reduce() with bigint comparison.
TraitsDict: typed as Record<string, TraitInfo> with as Trait casts 
for functions with optional extra parameters.
 */

import { Table, RevTable, trow, rowgen, Trait } from './tabltypes';
import { binomial } from './Binomial';
import { binomialinv } from './BinomialInv';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function gcd(a: bigint, b: bigint): bigint {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b !== 0n) { [a, b] = [b, a % b]; }
    return a;
}

function lcm(a: bigint, b: bigint): bigint {
    if (a === 0n || b === 0n) return 0n;
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    return a / gcd(a, b) * b;
}

/** Sum of prefix sums of a row: used by AccRevSum. */
function prefixSumTotal(row: bigint[]): bigint {
    let acc = 0n, total = 0n;
    for (const v of row) { acc += v; total += acc; }
    return total;
}

function dotproduct(vec: bigint[], tor: bigint[]): bigint {
    return vec.reduce((s, v, i) => s + v * tor[i], 0n);
}

function SeqToString(seq: bigint[], maxLine: number, maxTerms: number): string {
    const str = seq.slice(0, maxTerms).join(', ');
    return str.length <= maxLine ? str : str.slice(0, maxLine) + '...';
}

// ---------------------------------------------------------------------------
// Triangle views
// ---------------------------------------------------------------------------

export function Triangle(T: Table, size: number = 7): trow {
    return T.flat(size);
}

export function Trev(T: Table, size: number = 7): trow {
    return Array.from({ length: size }, (_, n) => T.rev(n)).flat();
}

export function Tinv(T: Table, size: number = 7): trow {
    return T.inv(size).flat();
}

export function Tinvrev(T: Table, size: number = 7): trow {
    return T.invrev(size).flat();
}

export function Trevinv(T: Table, size: number = 7): trow {
    return T.revinv(size).flat();
}

export function Toff11(T: Table, size: number = 8): trow {
    const T11 = new Table(T.off(1, 1), T.id + "off11");
    return T11.flat(size);
}

export function Trev11(T: Table, size: number = 8): trow {
    return Array.from({ length: size }, (_, n) => T.rev11(n)).flat();
}

export function Tinv11(T: Table, size: number = 8): trow {
    return T.inv11(size).flat();
}

export function Tinvrev11(T: Table, size: number = 8): trow {
    return T.invrev11(size).flat();
}

export function Trevinv11(T: Table, size: number = 8): trow {
    return T.revinv11(size).flat();
}

export function Talt(T: Table, size: number = 7): trow {
    return Array.from({ length: size }, (_, n) => T.alt(n)).flat();
}

export function Tacc(T: Table, size: number = 7): trow {
    return Array.from({ length: size }, (_, n) => T.acc(n)).flat();
}

export function Tder(T: Table, size: number = 8): trow {
    return Array.from({ length: size }, (_, n) => T.der(n)).flat();
}

export function Tantidiag(T: Table, size: number = 9): trow {
    return Array.from({ length: size }, (_, n) => T.antidiag(n)).flat();
}

// ---------------------------------------------------------------------------
// Column / diagonal extractors
// ---------------------------------------------------------------------------

export function TablCol(T: Table, col: number, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => T.val(col + n, col));
}

export function TablCol0(T: Table, size: number = 28, rev: boolean = false): trow {
    return rev ? TablDiag0(T, size) : Array.from({ length: size }, (_, n) => T.val(n, 0));
}

export function TablCol1(T: Table, size: number = 28, rev: boolean = false): trow {
    return rev ? TablDiag1(T, size) : Array.from({ length: size }, (_, n) => T.val(1 + n, 1));
}

export function TablCol2(T: Table, size: number = 28, rev: boolean = false): trow {
    return rev ? TablDiag2(T, size) : Array.from({ length: size }, (_, n) => T.val(2 + n, 2));
}

export function TablCol3(T: Table, size: number = 28, rev: boolean = false): trow {
    return rev ? TablDiag3(T, size) : Array.from({ length: size }, (_, n) => T.val(3 + n, 3));
}

export function TablDiag(T: Table, diag: number, size: number = 28): trow {
    return Array.from({ length: size }, (_, k) => T.val(diag + k, k));
}

export function TablDiag0(T: Table, size: number = 28, rev: boolean = false): trow {
    return rev ? TablCol0(T, size) : Array.from({ length: size }, (_, k) => T.val(k, k));
}

export function TablDiag1(T: Table, size: number = 28, rev: boolean = false): trow {
    return rev ? TablCol1(T, size) : Array.from({ length: size }, (_, k) => T.val(1 + k, k));
}

export function TablDiag2(T: Table, size: number = 28, rev: boolean = false): trow {
    return rev ? TablCol2(T, size) : Array.from({ length: size }, (_, k) => T.val(2 + k, k));
}

export function TablDiag3(T: Table, size: number = 28, rev: boolean = false): trow {
    return rev ? TablCol3(T, size) : Array.from({ length: size }, (_, k) => T.val(3 + k, k));
}

// ---------------------------------------------------------------------------
// Polynomial evaluations
// ---------------------------------------------------------------------------

export function PolyRow(T: Table, row: number, size: number = 28): trow {
    return Array.from({ length: size }, (_, v) => T.poly(row, BigInt(v)));
}

export function PolyRow1(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, v) => T.poly(1, BigInt(v)));
}

export function PolyRow2(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, v) => T.poly(2, BigInt(v)));
}

export function PolyRow3(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, v) => T.poly(3, BigInt(v)));
}

export function PolyCol(T: Table, col: number, size: number = 28): trow {
    return Array.from({ length: size }, (_, v) => T.poly(v, BigInt(col)));
}

export function PolyCol1(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, v) => T.poly(v, 1n));
}

export function PolyCol2(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, v) => T.poly(v, 2n));
}

export function PolyCol3(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, v) => T.poly(v, 3n));
}

export function PolyDiag(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => T.poly(n, BigInt(n)));
}

// ---------------------------------------------------------------------------
// LCM / GCD per row
// ---------------------------------------------------------------------------

export function RowLcmGcd(g: rowgen, row: number, lg: boolean): bigint {
    const Z = g(row).filter(v => v !== -1n && v !== 0n && v !== 1n);
    if (Z.length === 0) return 1n;
    return lg
        ? Z.reduce((a, b) => lcm(a, b), 1n)
        : Z.reduce((a, b) => gcd(a, b));
}

export function TablLcm(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => RowLcmGcd((r) => T.row(r), n, true));
}

export function TablGcd(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => RowLcmGcd((r) => T.row(r), n, false));
}

export function TablMax(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) =>
        T.row(n).reduce((a, t) => {
            const av = t < 0n ? -t : t;
            return av > a ? av : a;
        }, 0n)
    );
}

// ---------------------------------------------------------------------------
// Row sums and aggregates
// ---------------------------------------------------------------------------

export function TablSum(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => T.sum(n));
}

export function EvenSum(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) =>
        T.row(n).filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0n)
    );
}

export function OddSum(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) =>
        T.row(n).filter((_, i) => i % 2 === 1).reduce((a, b) => a + b, 0n)
    );
}

export function AltSum(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => {
        const row = T.row(n);
        const even = row.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0n);
        const odd  = row.filter((_, i) => i % 2 === 1).reduce((a, b) => a + b, 0n);
        return even - odd;
    });
}

export function AbsSum(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) =>
        T.row(n).reduce((a, t) => a + (t < 0n ? -t : t), 0n)
    );
}

export function AccSum(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) =>
        T.acc(n).reduce((a, b) => a + b, 0n)
    );
}

export function AccRevSum(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => prefixSumTotal(T.rev(n)));
}

export function AntiDSum(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) =>
        T.antidiag(n).reduce((a, b) => a + b, 0n)
    );
}

// ---------------------------------------------------------------------------
// Column specials
// ---------------------------------------------------------------------------

export function ColMiddle(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => T.val(n, Math.floor(n / 2)));
}

export function CentralE(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => T.val(2 * n, n));
}

export function CentralO(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => T.val(2 * n + 1, n));
}

export function ColLeft(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => T.val(n, 0));
}

export function ColRight(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => T.val(n, n));
}

// ---------------------------------------------------------------------------
// Polynomial fraction evaluation (Horner; row[0] is highest-degree coeff)
// ---------------------------------------------------------------------------

export function PolyFrac(row: bigint[], v: bigint): bigint {
    let result = 0n;
    for (const c of row) {
        result = result * v + c;
    }
    return result;
}

export function PosHalf(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => PolyFrac(T.row(n), 2n));
}

export function NegHalf(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => PolyFrac(T.row(n), -2n));
}

// ---------------------------------------------------------------------------
// Linear transforms
// ---------------------------------------------------------------------------

export function TransNat0(T: Table, size: number = 28): trow {
    return T.trans((k: number) => BigInt(k), size);
}

export function TransNat1(T: Table, size: number = 28): trow {
    return T.trans((k: number) => BigInt(k + 1), size);
}

export function TransSqrs(T: Table, size: number = 28): trow {
    return T.trans((k: number) => BigInt(k * k), size);
}

// ---------------------------------------------------------------------------
// Binomial / inverse-binomial convolution
// ---------------------------------------------------------------------------

export function BinConv(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => dotproduct(binomial(n), T.row(n)));
}

export function InvBinConv(T: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => dotproduct(binomialinv(n), T.row(n)));
}

// ---------------------------------------------------------------------------
// Rev* variants
// ---------------------------------------------------------------------------

export function RevToff11(t: Table, size: number = 8): trow {
    const T = RevTable(t);
    const T11 = new Table(T.off(1, 1), T.id + "off11");
    return T11.flat(size);
}

export function RevTrev11(t: Table, size: number = 8): trow {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => T.rev11(n)).flat();
}

export function RevTinv11(t: Table, size: number = 8): trow {
    const T = RevTable(t);
    return T.inv11(size).flat();
}

export function RevTalt(t: Table, size: number = 7): trow {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => T.alt(n)).flat();
}

export function RevTacc(t: Table, size: number = 7): trow {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => T.acc(n)).flat();
}

export function RevTder(t: Table, size: number = 8): trow {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => T.der(n)).flat();
}

export function RevTantidiag(t: Table, size: number = 9): trow {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => T.antidiag(n)).flat();
}

export function RevPolyRow1(t: Table, size: number = 28): trow {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, v) => T.poly(1, BigInt(v)));
}

export function RevPolyRow2(t: Table, size: number = 28): trow {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, v) => T.poly(2, BigInt(v)));
}

export function RevPolyRow3(t: Table, size: number = 28): trow {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, v) => T.poly(3, BigInt(v)));
}

export function RevPolyCol3(t: Table, size: number = 28): trow {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, v) => T.poly(v, 3n));
}

export function RevPolyDiag(t: Table, size: number = 28): trow {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => T.poly(n, BigInt(n)));
}

export function RevEvenSum(t: Table, size: number = 28): trow {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) =>
        T.row(n).filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0n)
    );
}

export function RevOddSum(t: Table, size: number = 28): trow {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) =>
        T.row(n).filter((_, i) => i % 2 === 1).reduce((a, b) => a + b, 0n)
    );
}

export function RevAccRevSum(t: Table, size: number = 28): trow {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => prefixSumTotal(T.rev(n)));
}

export function RevAntiDSum(t: Table, size: number = 28): trow {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) =>
        T.antidiag(n).reduce((a, b) => a + b, 0n)
    );
}

export function RevColMiddle(t: Table, size: number = 28): trow {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => T.val(n, Math.floor(n / 2)));
}

export function RevCentralO(t: Table, size: number = 28): trow {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => T.val(2 * n + 1, n));
}

/** RevPosHalf evaluates the reversed row polynomial at x = 2. */
export function RevPosHalf(t: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => PolyFrac(t.rev(n), 2n));
}

/** RevNegHalf evaluates the reversed row polynomial at x = -2. */
export function RevNegHalf(t: Table, size: number = 28): trow {
    return Array.from({ length: size }, (_, n) => PolyFrac(t.rev(n), -2n));
}

export function RevTransNat0(t: Table, size: number = 28): trow {
    const T = RevTable(t);
    return T.trans((k: number) => BigInt(k), size);
}

export function RevTransNat1(t: Table, size: number = 28): trow {
    const T = RevTable(t);
    return T.trans((k: number) => BigInt(k + 1), size);
}

export function RevTransSqrs(t: Table, size: number = 28): trow {
    const T = RevTable(t);
    return T.trans((k: number) => BigInt(k * k), size);
}

// ---------------------------------------------------------------------------
// Traits dictionary
// ---------------------------------------------------------------------------

/** A trait entry: [function, default size, TeX label]. */
export type TraitInfo = [Trait, number, string];

/** Maps each trait name to its function, default size, and TeX description.
 *  Must start with key 'Triangle'. */
export const TraitsDict: Record<string, TraitInfo> = {
    "Triangle":     [Triangle  as Trait,  7, String.raw`\(T_{n,k}\)`],
    "Tinv":         [Tinv      as Trait,  7, String.raw`\(T^{-1}_{n,k}\)`],
    "Trev":         [Trev      as Trait,  7, String.raw`\(T_{n,n-k}\)`],
    "Tinvrev":      [Tinvrev   as Trait,  7, String.raw`\((T_{n,n-k})^{-1}\)`],
    "Trevinv":      [Trevinv   as Trait,  7, String.raw`\((T^{-1})_{n,n-k}\)`],
    "Toff11":       [Toff11    as Trait,  7, String.raw`\(T_{n+1,k+1} \)`],
    "Trev11":       [Trev11    as Trait,  7, String.raw`\(T_{n+1,n-k+1} \)`],
    "Tinv11":       [Tinv11    as Trait,  7, String.raw`\(T^{-1}_{n+1,k+1}\)`],
    "Tinvrev11":    [Tinvrev11 as Trait,  7, String.raw`\((T_{n+1,n-k+1})^{-1}\)`],
    "Trevinv11":    [Trevinv11 as Trait,  7, String.raw`\((T^{-1}_{n+1,n-k+1})\)`],
    "Tantidiag":    [Tantidiag as Trait,  9, String.raw`\(T_{n-k,k}\ \ (k \le n/2)\)`],
    "Tacc":         [Tacc      as Trait,  7, String.raw`\(\sum_{j=0}^{k} T_{n,j}\)`],
    "Talt":         [Talt      as Trait,  7, String.raw`\(T_{n,k}\ (-1)^{k}\)`],
    "Tder":         [Tder      as Trait,  8, String.raw`\(T_{n,k+1}\ (k+1) \)`],
    "TablCol0":     [TablCol0  as Trait, 28, String.raw`\(T_{n  ,0}\)`],
    "TablCol1":     [TablCol1  as Trait, 28, String.raw`\(T_{n+1,1}\)`],
    "TablCol2":     [TablCol2  as Trait, 28, String.raw`\(T_{n+2,2}\)`],
    "TablCol3":     [TablCol3  as Trait, 28, String.raw`\(T_{n+3,3}\)`],
    "TablDiag0":    [TablDiag0 as Trait, 28, String.raw`\(T_{n  ,n}\)`],
    "TablDiag1":    [TablDiag1 as Trait, 28, String.raw`\(T_{n+1,n}\)`],
    "TablDiag2":    [TablDiag2 as Trait, 28, String.raw`\(T_{n+2,n}\)`],
    "TablDiag3":    [TablDiag3 as Trait, 28, String.raw`\(T_{n+3,n}\)`],
    "TablLcm":      [TablLcm   as Trait, 28, String.raw`\(\text{lcm} \{ \ \| T_{n,k} \| : k=0..n \} \)`],
    "TablGcd":      [TablGcd   as Trait, 28, String.raw`\(\text{gcd} \{ \ \| T_{n,k} \| : k=0..n \} \)`],
    "TablMax":      [TablMax   as Trait, 28, String.raw`\(\text{max} \{ \ \| T_{n,k} \| : k=0..n \} \)`],
    "TablSum":      [TablSum   as Trait, 28, String.raw`\(\sum_{k=0}^{n} T_{n,k}\)`],
    "EvenSum":      [EvenSum   as Trait, 28, String.raw`\(\sum_{k=0}^{n} T_{n,k}\ ( 2 \mid k) \)`],
    "OddSum":       [OddSum    as Trait, 28, String.raw`\(\sum_{k=0}^{n} T_{n,k}\ (1 - (2 \mid k)) \)`],
    "AltSum":       [AltSum    as Trait, 28, String.raw`\(\sum_{k=0}^{n} T_{n,k}\ (-1)^{k}\)`],
    "AbsSum":       [AbsSum    as Trait, 28, String.raw`\(\sum_{k=0}^{n} \| T_{n,k} \| \)`],
    "AccSum":       [AccSum    as Trait, 28, String.raw`\(\sum_{k=0}^{n} \sum_{j=0}^{k} T_{n,j}\)`],
    "AccRevSum":    [AccRevSum as Trait, 28, String.raw`\(\sum_{k=0}^{n} \sum_{j=0}^{k} T_{n,n-j}\)`],
    "AntiDSum":     [AntiDSum  as Trait, 28, String.raw`\(\sum_{k=0}^{n/2} T_{n-k, k}\)`],
    "ColMiddle":    [ColMiddle as Trait, 28, String.raw`\(T_{n, n / 2}\)`],
    "CentralE":     [CentralE  as Trait, 28, String.raw`\(T_{2 n, n}\)`],
    "CentralO":     [CentralO  as Trait, 28, String.raw`\(T_{2 n + 1, n}\)`],
    "PosHalf":      [PosHalf   as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ 2^{n-k} \)`],
    "NegHalf":      [NegHalf   as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ (-2)^{n-k} \)`],
    "TransNat0":    [TransNat0 as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ k\)`],
    "TransNat1":    [TransNat1 as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ (k+1)\)`],
    "TransSqrs":    [TransSqrs as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ k^{2}\)`],
    "BinConv":      [BinConv   as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ \binom{n}{k} \)`],
    "InvBinConv":   [InvBinConv as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ (-1)^{n-k}\ \binom{n}{k}\)`],
    "PolyRow1":     [PolyRow1  as Trait, 28, String.raw`\(\sum_{k=0}^{1}T_{1,k}\ n^k\)`],
    "PolyRow2":     [PolyRow2  as Trait, 28, String.raw`\(\sum_{k=0}^{2}T_{2,k}\ n^k\)`],
    "PolyRow3":     [PolyRow3  as Trait, 28, String.raw`\(\sum_{k=0}^{3}T_{3,k}\ n^k\)`],
    "PolyCol2":     [PolyCol2  as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ 2^k\)`],
    "PolyCol3":     [PolyCol3  as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ 3^k\)`],
    "PolyDiag":     [PolyDiag  as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ n^k\)`],
    "RevToff11":    [RevToff11    as Trait,  7, String.raw`\(T_{n+1,n-k} \)`],
    "RevTrev11":    [RevTrev11    as Trait,  7, String.raw`\(T_{n+1,k} \)`],
    "RevTinv11":    [RevTinv11    as Trait,  7, String.raw`\(T^{-1}_{n+1,n-k}\)`],
    "RevTantidiag": [RevTantidiag as Trait,  9, String.raw`\(T_{n-k,n-2k}\ \ (k \le n/2)\)`],
    "RevTacc":      [RevTacc      as Trait,  7, String.raw`\(\sum_{j=0}^{n-k}T_{n,n-j}\)`],
    "RevTalt":      [RevTalt      as Trait,  7, String.raw`\(T_{n,n-k}\ (-1)^{n-k}\)`],
    "RevTder":      [RevTder      as Trait,  8, String.raw`\(T_{n+1,n-k}\ (n-k+1) \)`],
    "RevEvenSum":   [RevEvenSum   as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ (2 \mid k) \)`],
    "RevOddSum":    [RevOddSum    as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ (1- (2 \mid k)) \)`],
    "RevAccRevSum": [RevAccRevSum as Trait, 28, String.raw`\(\sum_{k=0}^{n} \sum_{j=0}^{k}T_{n,n-j}\)`],
    "RevAntiDSum":  [RevAntiDSum  as Trait, 28, String.raw`\(\sum_{k=0}^{n/2}T_{n-k,n-k}\)`],
    "RevColMiddle": [RevColMiddle as Trait, 28, String.raw`\(T_{n, n/2}\)`],
    "RevCentralO":  [RevCentralO  as Trait, 28, String.raw`\(T_{2n+1,n}\)`],
    "RevPosHalf":   [RevPosHalf   as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ 2^{n-k} \)`],
    "RevNegHalf":   [RevNegHalf   as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ (-2)^{n-k} \)`],
    "RevTransNat0": [RevTransNat0 as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ k\)`],
    "RevTransNat1": [RevTransNat1 as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ (k + 1)\)`],
    "RevTransSqrs": [RevTransSqrs as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ k^{2}\)`],
    "RevPolyRow1":  [RevPolyRow1  as Trait, 28, String.raw`\(\sum_{k=0}^{1}T_{1,n-k}\ n^k\)`],
    "RevPolyRow2":  [RevPolyRow2  as Trait, 28, String.raw`\(\sum_{k=0}^{2}T_{2,n-k}\ n^k\)`],
    "RevPolyRow3":  [RevPolyRow3  as Trait, 28, String.raw`\(\sum_{k=0}^{3}T_{3,n-k}\ n^k\)`],
    "RevPolyCol3":  [RevPolyCol3  as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ 3^k\)`],
    "RevPolyDiag":  [RevPolyDiag  as Trait, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ n^k\)`],
};

// ---------------------------------------------------------------------------
// TableTraits: print all traits for a given Table
// ---------------------------------------------------------------------------

export function TableTraits(T: Table): void {
    for (const [traitId, tr] of Object.entries(TraitsDict)) {
        const name = T.id + '_' + traitId;
        const tex  = tr[2];
        const seq  = tr[0](T, tr[1]);
        console.log(name, tex);
        console.log(SeqToString(seq, 60, 20));
    }
}

if (require.main === module) {
    import('./Abel').then(({ Abel }) => {
        TableTraits(Abel);
    });
}