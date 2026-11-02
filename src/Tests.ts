/**
 * Generic Table test runner.
 *
 * TestTable(T) exercises every public method of a Table instance and
 * reports pass/fail for each invariant that can be verified without
 * knowing table-specific values.  Structural output (show, showarray,
 * diag, col, …) is printed as-is for visual inspection.
 *
 * Usage:
 *   import { TestTable }        from './Tests';
 *   import { Abel }             from './Abel';
 *   import { FallingFactorial } from './FallingFactorial';
 *
 *   TestTable(Abel);
 *   TestTable(FallingFactorial);
 *
 * Run directly:
 *   npx ts-node Tests.ts
 */

import { Table } from './tabltypes';
import { Bench } from './tablutils';

// ── helpers ───────────────────────────────────────────────────────────────────

function section(title: string): void {
    console.log('\n' + '─'.repeat(60));
    console.log(' ' + title);
    console.log('─'.repeat(60));
}

const bigintReplacer = (_: string, v: unknown) =>
    typeof v === 'bigint' ? v.toString() : v;

function check(label: string, actual: unknown, expected: unknown): void {
    const pass =
        JSON.stringify(actual, bigintReplacer) ===
        JSON.stringify(expected, bigintReplacer);
    const mark = pass ? '✓' : '✗';
    console.log(`  ${mark}  ${label}`);
    if (!pass) {
        console.log(`       expected: ${JSON.stringify(expected, bigintReplacer)}`);
        console.log(`       actual  : ${JSON.stringify(actual,   bigintReplacer)}`);
    }
}

// ── main ──────────────────────────────────────────────────────────────────────

/**
 * Runs the full test suite against any Table instance.
 * @param T    The Table to test.
 * @param size Controls how many rows are used (default 7). Must be >= 4.
 */
export function TestTable(T: Table, size: number = 7): void {

    // ── 1. Triangle (show) ────────────────────────────────────────────────────

    section(`[${T.id}]  Triangle — show(${size + 2})`);
    T.show(size + 2);

    // ── 2. Triangle (show with row sums) ─────────────────────────────────────

    section(`[${T.id}]  Triangle — show(${size - 1}, total = true)`);
    T.show(size - 1, true);

    // ── 3. Array form (showarray) ─────────────────────────────────────────────

    section(`[${T.id}]  Array form — showarray(${size - 1})`);
    T.showarray(size - 1);

    // ── 4. Individual rows ────────────────────────────────────────────────────

    section(`[${T.id}]  row(n)`);
    for (let n = 0; n <= Math.min(size, 5); n++) {
        console.log(`  row(${n}) = [${T.row(n).join(', ')}]`);
    }

    // ── 5. val — equals row(n)[k] ─────────────────────────────────────────────

    section(`[${T.id}]  val(n, k) — val(n, k) === row(n)[k]`);
    for (let n = 0; n <= Math.min(size, 4); n++) {
        for (let k = 0; k <= n; k++) {
            check(
                `val(${n}, ${k}) === row(${n})[${k}]`,
                T.val(n, k),
                T.row(n)[k]
            );
        }
    }

    // ── 6. tab — each row matches row(n) ─────────────────────────────────────

    section(`[${T.id}]  tab(${size}) — tab(size)[n] === row(n)`);
    const tbl = T.tab(size);
    for (let n = 0; n < size; n++) {
        check(`tab(${size})[${n}] === row(${n})`, tbl[n], T.row(n));
    }

    // ── 7. mat — lower-triangular matrix ─────────────────────────────────────

    section(`[${T.id}]  mat(${size}) — lower-triangular`);
    const m = T.mat(size);
    for (const row of m) console.log('  [' + row.join(', ') + ']');

    let matOk = true;
    for (let n = 0; n < size && matOk; n++) {
        for (let k = n + 1; k < size; k++) {
            if (m[n][k] !== 0n) { matOk = false; break; }
        }
    }
    check(`mat(${size}) zeros above diagonal`, matOk, true);

    for (let n = 0; n < size; n++) {
        check(`mat(${size})[${n}][${n}] === val(${n}, ${n})`, m[n][n], T.val(n, n));
    }

    // ── 8. rev — reversed row ─────────────────────────────────────────────────

    section(`[${T.id}]  rev(n) — rev(n) === row(n).reverse()`);
    for (let n = 0; n <= Math.min(size, 4); n++) {
        check(
            `rev(${n}) === [...row(${n})].reverse()`,
            T.rev(n),
            [...T.row(n)].reverse()
        );
    }

    // ── 9. alt — alternating signs ────────────────────────────────────────────

    section(`[${T.id}]  alt(n) — alt(n)[k] === (-1)^k * row(n)[k]`);
    for (let n = 0; n <= Math.min(size, 4); n++) {
        check(
            `alt(${n}) has alternating signs`,
            T.alt(n),
            T.row(n).map((v, k) => k % 2 === 0 ? v : -v)
        );
    }

    // ── 10. acc — accumulated row ─────────────────────────────────────────────

    section(`[${T.id}]  acc(n) — last element equals sum(n)`);
    for (let n = 0; n <= Math.min(size, 4); n++) {
        const a = T.acc(n);
        check(`acc(${n}).at(-1) === sum(${n})`, a[a.length - 1], T.sum(n));
    }

    // ── 11. diff — first differences ─────────────────────────────────────────

    section(`[${T.id}]  diff(n) — round-trip: acc(diff(n)) === row(n)`);
    for (let n = 1; n <= Math.min(size, 4); n++) {
        let s = 0n;
        const roundTrip = T.diff(n).map(v => (s += v, s));
        check(`acc(diff(${n})) === row(${n})`, roundTrip, T.row(n));
    }

    // ── 12. der — derivative of row polynomial ────────────────────────────────

    section(`[${T.id}]  der(n) — der(n)[j] === row(n)[j+1] * (j+1)`);
    for (let n = 1; n <= Math.min(size, 4); n++) {
        const expected = Array.from(
            { length: n },
            (_, j) => T.row(n)[j + 1] * BigInt(j + 1)
        );
        check(`der(${n}) === [row(${n})[j+1]*(j+1)]`, T.der(n), expected);
    }

    // ── 13. sum — row sums ────────────────────────────────────────────────────

    section(`[${T.id}]  sum(n) — equals row(n).reduce(+)`);
    for (let n = 0; n <= Math.min(size, 5); n++) {
        const expected = T.row(n).reduce((a, b) => a + b, 0n);
        check(`sum(${n}) === reduce(row(${n}))`, T.sum(n), expected);
    }

    // ── 14. flat — triangle read by rows ─────────────────────────────────────

    section(`[${T.id}]  flat(${size}) — length and spot checks`);
    const flat = T.flat(size);
    const expectedLen = size * (size + 1) / 2;
    check(`flat(${size}).length === ${expectedLen}`, flat.length, expectedLen);
    check(`flat(${size})[0] === val(0, 0)`, flat[0], T.val(0, 0));
    // Last element of flat is the last element of row(size-1)
    const lastRow = T.row(size - 1);
    check(
        `flat(${size}).at(-1) === row(${size - 1}).at(-1)`,
        flat[flat.length - 1],
        lastRow[lastRow.length - 1]
    );

    // ── 15. diag — upward diagonal ────────────────────────────────────────────

    section(`[${T.id}]  diag(n, ${size}) — diag(n, size)[i] === val(n+i, i)`);
    for (let n = 0; n <= 2; n++) {
        console.log(`  diag(${n}, ${size}) = [${T.diag(n, size).join(', ')}]`);
    }
    for (let n = 0; n <= 2; n++) {
        check(
            `diag(${n}, ${size})[i] === val(${n}+i, i)`,
            T.diag(n, size),
            Array.from({ length: size }, (_, i) => T.val(n + i, i))
        );
    }

    // ── 16. col — column ──────────────────────────────────────────────────────

    section(`[${T.id}]  col(k, ${size}) — col(k, size)[i] === val(k+i, k)`);
    for (let k = 0; k <= 2; k++) {
        console.log(`  col(${k}, ${size}) = [${T.col(k, size).join(', ')}]`);
    }
    for (let k = 0; k <= 2; k++) {
        check(
            `col(${k}, ${size})[i] === val(${k}+i, ${k})`,
            T.col(k, size),
            Array.from({ length: size }, (_, i) => T.val(k + i, k))
        );
    }

    // ── 17. antidiag ──────────────────────────────────────────────────────────

    section(`[${T.id}]  antidiag(n) — antidiag(n)[k] === T(n-k, k)`);
    for (let n = 0; n <= Math.min(size, 4); n++) {
        console.log(`  antidiag(${n}) = [${T.antidiag(n).join(', ')}]`);
    }
    for (let n = 0; n <= Math.min(size, 4); n++) {
        const len = Math.floor((n + 2) / 2);
        check(
            `antidiag(${n})[k] === T(${n}-k, k)`,
            T.antidiag(n),
            Array.from({ length: len }, (_, k) => T.row(n - k)[k])
        );
    }

    // ── 18. poly — row polynomial ─────────────────────────────────────────────

    section(`[${T.id}]  poly(n, x) — poly(n, 1n) === sum(n)`);
    for (let n = 0; n <= Math.min(size, 4); n++) {
        check(`poly(${n}, 1n) === sum(${n})`, T.poly(n, 1n), T.sum(n));
    }

    // ── 19. trans ─────────────────────────────────────────────────────────────

    section(`[${T.id}]  trans(s, ${size}) — transform of s(n) = n`);
    const trans = T.trans(n => BigInt(n), size);
    console.log('  [' + trans.join(', ') + ']');

    // ── 20. invtrans ──────────────────────────────────────────────────────────

    section(`[${T.id}]  invtrans(s, ${size}) — inverse transform of s(n) = n²`);
    const invtrans = T.invtrans(n => BigInt(n * n), size);
    console.log('  [' + invtrans.join(', ') + ']');

    // ── 21. off — sub-triangle ────────────────────────────────────────────────

    section(`[${T.id}]  off(0, 0)(n) — equals row(n)`);
    const off00 = T.off(0, 0);
    for (let n = 0; n < Math.min(size, 4); n++) {
        check(`off(0, 0)(${n}) === row(${n})`, off00(n), T.row(n));
    }

    // ── 22. inv — inverse triangle ────────────────────────────────────────────

    if (T.invQ) {
        section(`[${T.id}]  inv(${size}) — inverse triangle  (${T.invid})`);
        const inv = T.inv(size);
        for (const row of inv) console.log('  [' + row.join(', ') + ']');
    } else {
        section(`[${T.id}]  inv — skipped (invQ = false, no registered inverse)`);
    }

    // ── 23. revinv ────────────────────────────────────────────────────────────

    if (T.invQ) {
        section(`[${T.id}]  revinv(${size})`);
        const ri = T.revinv(size);
        for (const row of ri) console.log('  [' + row.join(', ') + ']');
    }

    // ── 24. Metadata ──────────────────────────────────────────────────────────

    section(`[${T.id}]  Metadata`);
    console.log(`  id:    ${T.id}`);
    console.log(`  oeis:  ${T.oeis.join(', ')}`);
    console.log(`  invid: ${T.invid}`);
    console.log(`  invQ:  ${T.invQ}`);
    console.log(`  tex:   ${T.tex}`);

    // ── 25. Benchmark ─────────────────────────────────────────────────────────

    section(`[${T.id}]  Benchmark`);
    Bench(T.gen, T.id);

    console.log(`\n[${T.id}]  Done.\n`);
}

// ── entry point (run directly: npx ts-node Tests.ts) ─────────────────────────

import { Abel }             from './Abel';
import { Bell }             from './Bell';
import { Bessel }           from './Bessel';
import { BesselInv }        from './BesselInv';
import { BinaryPell }       from './BinaryPell';
import { Binomial }         from './Binomial';
import { BinomialCatalan }  from './BinomialCatalan';
import { BinomialInv }      from './BinomialInv';
import { Catalan }          from './Catalan';
import { CatalanInv }       from './CatalanInv';
import { CatalanPaths }     from './CatalanPaths';
import { Chains }           from './Chains';
import { ChebyshevS }       from './ChebyshevS';
import { ChebyshevT }       from './ChebyshevT';
import { ChebyshevU }       from './ChebyshevU';
import { CompositionLP }    from './CompositionLP';
import { Delannoy }         from './Delannoy';
import { DelannoyInv }      from './DelannoyInv';
import { Divisibility }     from './Divisibility';
import { DyckPaths }        from './DyckPaths';
import { DyckPathsInv }     from './DyckPathsInv';
import { Entringer }        from './Entringer';
import { Euler }            from './Euler';
import { Eulerian }         from './Eulerian';
import { EulerSec }         from './EulerSec';
import { EulerTan }         from './EulerTan';
import { FallingFactorial } from './FallingFactorial';
import { Fibonacci }        from './Fibonacci';
import { Fubini }           from './Fubini';
import { Gaussq2 }          from './Gaussq2';
import { Genocchi }         from './Genocchi';
import { Laguerre }         from './Laguerre';
import { Lah }              from './Lah';
import { Lehmer }           from './Lehmer';
import { Leibniz }          from './Leibniz';
import { Lucas }            from './Lucas';
import { Moebius }          from './Moebius';
import { Monotone }         from './Monotone';
import { Motzkin }          from './Motzkin';
import { Narayana }         from './Narayana';
import { Nicomachus }       from './Nicomachus';
import { Parades }          from './Parades';
import { Partition }        from './Partition';
import { Powers }           from './Powers';
import { PowLaguerre }      from './PowLaguerre';
import { Rencontres }       from './Rencontres';
import { RisingFactorial }  from './RisingFactorial';
import { Schroeder }        from './Schroeder';
import { Sierpinski }       from './Sierpinski';
import { StirlingCycle }    from './StirlingCycle';
import { StirlingSet }      from './StirlingSet';
import { TernaryTrees }     from './TernaryTrees';
import { UpDownWords }      from './UpDownWords';
import { Worpitzky }        from './Worpitzky';

if (require.main === module) {
    TestTable(Abel);
    TestTable(Bell);
    TestTable(Bessel);
    TestTable(BesselInv);
    TestTable(BinaryPell);
    TestTable(Binomial);
    TestTable(BinomialCatalan);
    TestTable(BinomialInv);
    TestTable(Catalan);
    TestTable(CatalanInv);
    TestTable(CatalanPaths);
    TestTable(Chains);
    TestTable(ChebyshevS);
    TestTable(ChebyshevT);
    TestTable(ChebyshevU);
    TestTable(CompositionLP);
    TestTable(Delannoy);
    TestTable(DelannoyInv);
    TestTable(Divisibility);
    TestTable(DyckPaths);
    TestTable(DyckPathsInv);
    TestTable(Entringer);
    TestTable(Euler);
    TestTable(Eulerian);
    TestTable(EulerSec);
    TestTable(EulerTan);
    TestTable(FallingFactorial);
    TestTable(Fibonacci);
    TestTable(Fubini);
    TestTable(Gaussq2);
    TestTable(Genocchi);
    TestTable(Laguerre);
    TestTable(Lah);
    TestTable(Lehmer);
    TestTable(Leibniz);
    TestTable(Lucas);
    TestTable(Moebius);
    TestTable(Monotone);
    TestTable(Motzkin);
    TestTable(Narayana);
    TestTable(Nicomachus);
    TestTable(Parades);
    TestTable(Partition);
    TestTable(Powers);
    TestTable(PowLaguerre);
    TestTable(Rencontres);
    TestTable(RisingFactorial);
    TestTable(Schroeder);
    TestTable(Sierpinski);
    TestTable(StirlingCycle);
    TestTable(StirlingSet);
    TestTable(TernaryTrees);
    TestTable(UpDownWords);
    TestTable(Worpitzky);
}
