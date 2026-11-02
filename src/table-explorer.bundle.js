const __tableExplorerRequire = { main: null }; const __tableExplorerModule = {};
"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // tablinverse.ts
  function InvertMatrix(L, check2 = true) {
    const n = L.length;
    const inv = Array.from(
      { length: n },
      (_, i) => Array.from({ length: n }, (_2, j) => i === j ? 1n : 0n)
    );
    for (let k = 0; k < n; k++) {
      for (let j = 0; j < n; j++) {
        for (let i = 0; i < k; i++) {
          inv[k][j] -= inv[i][j] * L[k][i];
        }
        if (check2) {
          const a = inv[k][j];
          const b = L[k][k];
          if (b === 0n) return [];
          const r = a % b;
          if (r !== 0n) return [];
        }
      }
    }
    return inv.map((row, n2) => row.slice(0, n2 + 1));
  }
  var init_tablinverse = __esm({
    "tablinverse.ts"() {
      "use strict";
    }
  });

  // tabltypes.ts
  function RevTable(T) {
    const cache = /* @__PURE__ */ new Map();
    function revgen(n) {
      if (!cache.has(n)) cache.set(n, T.rev(n));
      return cache.get(n);
    }
    return new Table(revgen, T.id + ":Rev");
  }
  var Table;
  var init_tabltypes = __esm({
    "tabltypes.ts"() {
      "use strict";
      init_tablinverse();
      Table = class {
        /**
         * @param gen   Row generator: gen(n) returns bigint[] of length n+1 for n >= 0.
         * @param id    Name of the triangle.
         * @param oeis  A-numbers of closely related OEIS triangles.
         * @param invid Identifier of the inverse triangle (empty string if none).
         * @param tex   Defining formula as a TeX string.
         */
        constructor(gen, id, oeis = [""], invid = "", tex = "") {
          this.gen = gen;
          this.id = id;
          this.oeis = oeis;
          this.invid = invid;
          this.tex = tex;
          this.invQ = invid !== "";
        }
        /**
         * Returns the n-th row of the triangle.
         * @throws {RangeError} if n < 0.
         */
        row(n) {
          if (n < 0) throw new RangeError("0 <= n expected");
          return this.gen(n);
        }
        /**
         * Returns the term T(n, k).
         * @throws {RangeError} if k > n, k < 0, or n < 0.
         */
        val(n, k) {
          if (k > n || k < 0 || n < 0) throw new RangeError("0<=k<=n expected");
          return this.row(n)[k];
        }
        /**
         * Generator that yields the first `size` rows.
         * @example
         * for (const r of Abel.itr(5)) console.log(r);
         */
        *itr(size) {
          for (let n = 0; n < size; n++) yield this.row(n);
        }
        /**
         * Returns the first `size` rows as an array.
         * @example Abel.tab(5) // [[1n],[0n,1n],[0n,2n,1n],...]
         */
        tab(size) {
          return Array.from({ length: size }, (_, n) => [...this.row(n)]);
        }
        /**
         * Returns a size×size lower-triangular matrix (zeros above diagonal).
         * @example Abel.mat(5) // [[1n,0n,...],[0n,1n,0n,...],...]
         */
        mat(size) {
          return Array.from(
            { length: size },
            (_, n) => Array.from({ length: size }, (_2, k) => k <= n ? this.row(n)[k] : 0n)
          );
        }
        /**
         * Returns the n-th row reversed.
         * @example Abel.rev(4) // [1n,12n,48n,64n,0n]
         */
        rev(n) {
          return [...this.row(n)].reverse();
        }
        /**
         * Returns the n-th antidiagonal: [T(n,0), T(n-1,1), ..., T(ceil(n/2), floor(n/2))].
         * @example Motzkin.antidiag(4) // [9n,5n,1n]
         */
        antidiag(n) {
          const len = Math.floor((n + 2) / 2);
          return Array.from({ length: len }, (_, k) => this.row(n - k)[k]);
        }
        /**
         * Returns the n-th row with alternating signs: T(n,k) * (-1)^k.
         * @example Abel.alt(4) // [0n,-64n,48n,-12n,1n]
         */
        alt(n) {
          return this.row(n).map((term, k) => k % 2 === 0 ? term : -term);
        }
        /**
         * Returns the accumulated (prefix-sum) version of the n-th row.
         * @example Abel.acc(4) // [0n,64n,112n,124n,125n]
         */
        acc(n) {
          const result = [];
          let s = 0n;
          for (const v of this.row(n)) {
            s += v;
            result.push(s);
          }
          return result;
        }
        /**
         * Returns the first differences of the n-th row.
         * Satisfies: acc(diff(n)) == row(n).
         * @example Abel.diff(4) // [0n,64n,-16n,-36n,-11n]
         */
        diff(n) {
          const r = this.row(n);
          if (r.length === 0) return [];
          const result = [r[0]];
          for (let i = 1; i < r.length; i++) result.push(r[i] - r[i - 1]);
          return result;
        }
        /**
         * Returns the coefficients of the derivative of the n-th row polynomial.
         * der(n)[j] = T(n, j+1) * (j+1)
         * @example Abel.der(4) // [64n,96n,36n,4n]
         */
        der(n) {
          if (n === 0) return [0n];
          const coeffs = this.row(n);
          return Array.from({ length: n }, (_, j) => coeffs[j + 1] * BigInt(j + 1));
        }
        /**
         * Returns the n-th upward diagonal of length `size`: [T(n,0), T(n+1,1), ...].
         * @example Abel.diag(1, 5) // [0n,2n,6n,12n,20n]
         */
        diag(n, size) {
          return Array.from({ length: size }, (_, k) => this.row(n + k)[k]);
        }
        /**
         * Returns the k-th column of length `size` starting at the diagonal: [T(k,k), T(k+1,k), ...].
         * @example Abel.col(1, 5) // [1n,2n,9n,64n,625n]
         */
        col(k, size) {
          return Array.from({ length: size }, (_, n) => this.row(k + n)[k]);
        }
        /**
         * Returns the sum of the n-th row.
         * @example Abel.sum(4) // 125n
         */
        sum(n) {
          return this.row(n).reduce((a, b) => a + b, 0n);
        }
        /**
         * Returns the triangle flattened into a single array (first `size` rows).
         * @example Abel.flat(5) // [1n,0n,1n,0n,2n,1n,...]
         */
        flat(size) {
          const result = [];
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
        inv(size) {
          if (!this.invQ) return [];
          const M = Array.from({ length: size }, (_, n) => [...this.row(n)]);
          const V = InvertMatrix(M);
          if (V.length === 0) {
            this.invQ = false;
            return [];
          }
          return V;
        }
        /**
         * Returns the inverse table with each row reversed, or [] if not invertible.
         * @example Abel.revinv(4) // [[1n],[1n,0n],[1n,-2n,0n],[1n,-6n,3n,0n]]
         */
        revinv(size) {
          const V = this.inv(size);
          if (V.length === 0) return [];
          return V.map((r, n) => Array.from({ length: n + 1 }, (_, k) => r[n - k]));
        }
        /**
         * Returns the inverse of the table formed by reversing each row, or [] if not invertible.
         * @example Abel.invrev(4) // []
         */
        invrev(size) {
          const M = Array.from({ length: size }, (_, n) => [...this.row(n)].reverse());
          return InvertMatrix(M);
        }
        /**
         * Returns a row generator for the sub-triangle rooted at (N, K).
         * subgen(n) = row(n + N)[K .. N+n]
         * @example Abel.off(1,1)(3) // [64n,48n,12n,1n]
         */
        off(N, K) {
          return (n) => this.row(n + N).slice(K, N + n + 1);
        }
        /**
         * Returns the reversed n-th row of the sub-triangle with offset (1,1).
         * @example Abel.rev11(3) // [1n,12n,48n,64n]
         */
        rev11(n) {
          return [...this.off(1, 1)(n)].reverse();
        }
        /**
         * Returns the matrix inverse of the sub-triangle with offset (1,1), or [] if singular.
         * @example Abel.inv11(4) // [[1n],[-2n,1n],[3n,-6n,1n],[-4n,24n,-12n,1n]]
         */
        inv11(size) {
          const M = Array.from({ length: size }, (_, n) => [...this.off(1, 1)(n)]);
          return InvertMatrix(M);
        }
        /**
         * Returns the inverse of the (1,1)-offset sub-table with rows reversed, or [].
         * @example Abel.revinv11(4) // [[1n],[1n,-2n],[1n,-6n,3n],[1n,-12n,24n,-4n]]
         */
        revinv11(size) {
          return this.inv11(size).map((r) => [...r].reverse());
        }
        /**
         * Returns the inverse of the reversed (1,1)-offset sub-table, or [].
         * @example Abel.invrev11(4) // []
         */
        invrev11(size) {
          const M = Array.from({ length: size }, (_, n) => [...this.off(1, 1)(n)].reverse());
          return InvertMatrix(M);
        }
        /**
         * Evaluates the n-th row polynomial at x (coefficients in ascending power order).
         * Returns sum(T(n,k) * x^k for k=0..n).
         * @example Abel.poly(4, 2n) // 432n
         */
        poly(n, x) {
          return this.row(n).reduce((acc, c, j) => acc + c * x ** BigInt(j), 0n);
        }
        /**
         * Binomial-transform-style: returns [sum(T(n,k)*s(k), k=0..n) for n=0..size-1].
         * @example Abel.trans(n => BigInt(n), 6) // [0n,1n,4n,24n,200n,2160n]
         */
        trans(s, size) {
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
        invtrans(s, size) {
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
        show(size, total = false) {
          for (let n = 0; n < size; n++) {
            const r = this.row(n);
            const rowSum = r.reduce((a, b) => a + b, 0n);
            console.log(`[${n}] [${r.join(", ")}]${total ? ` [${rowSum}]` : ""}`);
          }
        }
        /**
         * Prints the triangle read by upward antidiagonals (size columns per row).
         * @example Abel.showarray(5)
         * // [0] [1n, 1n, 1n, 1n, 1n]
         * // [1] [0n, 2n, 6n, 12n, 20n]
         * // ...
         */
        showarray(size) {
          for (let n = 0; n < size; n++) {
            const d = this.diag(n, size);
            console.log(`[${n}] [${d.join(", ")}]`);
          }
        }
      };
    }
  });

  // Binomial.ts
  function binomial(n) {
    if (binomialCache.has(n)) return binomialCache.get(n);
    if (n === 0) {
      const result = [1n];
      binomialCache.set(0, result);
      return result;
    }
    const row = [1n, ...binomial(n - 1)];
    for (let k = 1; k < n; k++) {
      row[k] += row[k + 1];
    }
    binomialCache.set(n, row);
    return row;
  }
  var binomialCache, Binomial;
  var init_Binomial = __esm({
    "Binomial.ts"() {
      "use strict";
      init_tabltypes();
      binomialCache = /* @__PURE__ */ new Map();
      Binomial = new Table(
        binomial,
        "Binomial",
        [
          "A007318",
          "A074909",
          "A108086",
          "A117440",
          "A118433",
          "A130595",
          "A135278",
          "A154926"
        ],
        "A130595",
        String.raw`n! \, / (k! \, (n - k)! )`
      );
    }
  });

  // BinomialInv.ts
  function binomialinv(n) {
    return binomial(n).map((v, k) => (n - k) % 2 === 0 ? v : -v);
  }
  var BinomialInv;
  var init_BinomialInv = __esm({
    "BinomialInv.ts"() {
      "use strict";
      init_tabltypes();
      init_Binomial();
      BinomialInv = new Table(
        binomialinv,
        "BinomialInv",
        ["A130595"],
        "A007318",
        String.raw`(-1)^{n-k} \, n! \, / (k! \, (n - k)! )`
      );
    }
  });

  // Abel.ts
  var Abel_exports = {};
  __export(Abel_exports, {
    Abel: () => Abel
  });
  function abel(n) {
    if (abelCache.has(n)) return abelCache.get(n);
    if (n === 0) {
      const result = [1n];
      abelCache.set(0, result);
      return result;
    }
    const row = new Array(n + 1).fill(0n);
    let c = 1n;
    let p = BigInt(n) ** BigInt(n - 1);
    for (let k = 1; k <= n; k++) {
      row[k] = c * p;
      if (k < n) {
        c = c * BigInt(n - k) / BigInt(k);
        p = p / BigInt(n);
      }
    }
    abelCache.set(n, row);
    return row;
  }
  var abelCache, Abel;
  var init_Abel = __esm({
    "Abel.ts"() {
      "use strict";
      init_tabltypes();
      abelCache = /* @__PURE__ */ new Map();
      Abel = new Table(
        abel,
        "Abel",
        ["A137452", "A061356", "A139526"],
        "A059297",
        String.raw`is(k = 0)\ ? \ 0^n : \binom{n-1}{k-1} (-n)^{n - k}`
      );
    }
  });

  // tablutils.ts
  function Bench(f, name = "", len = 8) {
    const label = (name || f.name || "f").padEnd(12);
    const steps = STEPS.slice(0, len);
    for (const X of steps) {
      const t0 = performance.now();
      for (let n = 0; n < X; n++) {
        f(n);
      }
      const elapsed = performance.now() - t0;
      console.log(`${label}  X=${String(X).padStart(5)}  time=${elapsed.toFixed(0).padStart(8)} ms`);
    }
  }
  var STEPS;
  var init_tablutils = __esm({
    "tablutils.ts"() {
      "use strict";
      STEPS = [5, 25, 100, 200, 300, 400, 600, 1e3];
    }
  });

  // Bessel.ts
  function bessel(n) {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];
    const cached = besselCache.get(n);
    if (cached !== void 0) return cached;
    const row = [...bessel(n - 1), 1n];
    for (let k = n - 1; k >= 1; k--) {
      row[k] = row[k - 1] + BigInt(2 * (n - 1) - k) * row[k];
    }
    besselCache.set(n, row);
    return row;
  }
  var besselCache, Bessel;
  var init_Bessel = __esm({
    "Bessel.ts"() {
      "use strict";
      init_tabltypes();
      besselCache = /* @__PURE__ */ new Map();
      Bessel = new Table(
        bessel,
        "Bessel",
        ["A132062", "A001497", "A001498", "A122850"],
        "A122848",
        String.raw`2^{k - n} \binom{2n - 2k}{n - k} \binom{2n - k - 1}{k - 1} (n - k)!`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Bessel));
      }
    }
  });

  // BesselInv.ts
  function besselinv(n) {
    if (n === 0) return [1n];
    const cached = besselInvCache.get(n);
    if (cached !== void 0) return cached;
    const b = besselinv(n - 1);
    const mid = Array.from({ length: n - 1 }, (_, i) => {
      const k = i + 1;
      return BigInt(2 * k - n + 1) * b[k] + b[k - 1];
    });
    const result = [0n, ...mid, 1n];
    besselInvCache.set(n, result);
    return result;
  }
  var besselInvCache, BesselInv;
  var init_BesselInv = __esm({
    "BesselInv.ts"() {
      "use strict";
      init_tabltypes();
      besselInvCache = /* @__PURE__ */ new Map();
      BesselInv = new Table(
        besselinv,
        "BesselInv",
        ["A122848", "A104556", "A096713"],
        "A132062",
        String.raw`T(n,k)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(BesselInv));
      }
    }
  });

  // BinaryPell.ts
  function binarypell(n) {
    if (binaryPellCache.has(n)) return binaryPellCache.get(n);
    if (n === 0) {
      const result = [1n];
      binaryPellCache.set(0, result);
      return result;
    }
    const arow = binarypell(n - 1);
    const row = [...arow, 1n];
    for (let k = n - 1; k >= 1; k--) {
      row[k] = arow[k - 1] + 2n * arow[k];
    }
    row[0] = 2n * arow[0];
    binaryPellCache.set(n, row);
    return row;
  }
  var binaryPellCache, BinaryPell;
  var init_BinaryPell = __esm({
    "BinaryPell.ts"() {
      "use strict";
      init_tabltypes();
      binaryPellCache = /* @__PURE__ */ new Map();
      BinaryPell = new Table(
        binarypell,
        "BinaryPell",
        ["A038207"],
        "A065109",
        String.raw`\binom{n}{k} \, 2^{n-k}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(BinaryPell));
      }
    }
  });

  // BinomialCatalan.ts
  function binomialcatalan(n) {
    if (binomialCatalanCache.has(n)) return binomialCatalanCache.get(n);
    if (n === 0) {
      const result = [1n];
      binomialCatalanCache.set(0, result);
      return result;
    }
    const a = [...binomialcatalan(n - 1), 0n];
    const row = new Array(n + 1).fill(0n);
    row[0] = 1n;
    row[1] = BigInt(n);
    for (let k = 2; k <= n; k++) {
      row[k] = (a[k] * BigInt(n + k + 1) + a[k - 1] * BigInt(4 * k - 2)) / BigInt(n + 1);
    }
    binomialCatalanCache.set(n, row);
    return row;
  }
  var binomialCatalanCache, BinomialCatalan;
  var init_BinomialCatalan = __esm({
    "BinomialCatalan.ts"() {
      "use strict";
      init_tabltypes();
      binomialCatalanCache = /* @__PURE__ */ new Map();
      BinomialCatalan = new Table(
        binomialcatalan,
        "BinomialCatalan",
        ["A124644", "A098474"],
        "A000000",
        String.raw`\binom{n}{k} \text{Catalan}(n - k)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(BinomialCatalan));
      }
    }
  });

  // Catalan.ts
  function catalan(n) {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];
    const cached = catalanCache.get(n);
    if (cached !== void 0) return cached;
    const prev = [...catalan(n - 1), 0n];
    const middle = Array.from(
      { length: n - 1 },
      (_, i) => prev[i] + 2n * prev[i + 1] + prev[i + 2]
    );
    const result = [0n, ...middle, 1n];
    catalanCache.set(n, result);
    return result;
  }
  var catalanCache, Catalan;
  var init_Catalan = __esm({
    "Catalan.ts"() {
      "use strict";
      init_tabltypes();
      catalanCache = /* @__PURE__ */ new Map();
      Catalan = new Table(
        catalan,
        "Catalan",
        ["A128899", "A039598"],
        "A128908",
        String.raw`\sum_{i=1}^{n-k+1} \text{Catalan}(i) T_{k-1, n-i}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Catalan));
      }
    }
  });

  // CatalanInv.ts
  function catalaninv(n) {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];
    const cached = catalanInvCache.get(n);
    if (cached !== void 0) return cached;
    const c0 = [...catalaninv(n - 2), 0n, 0n];
    const c1 = [...catalaninv(n - 1), 0n];
    const mid = Array.from({ length: n }, (_, i) => c1[i] + 2n * c1[i + 1] - c0[i + 1]);
    const result = [0n, ...mid];
    catalanInvCache.set(n, result);
    return result;
  }
  var catalanInvCache, CatalanInv;
  var init_CatalanInv = __esm({
    "CatalanInv.ts"() {
      "use strict";
      init_tabltypes();
      catalanInvCache = /* @__PURE__ */ new Map();
      CatalanInv = new Table(
        catalaninv,
        "CatalanInv",
        ["A128908", "A053122", "A078812", "A285072"],
        "A128899",
        String.raw`\binom{n+k-1}{2k-1}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(CatalanInv));
      }
    }
  });

  // CatalanPaths.ts
  function catalanpaths(n) {
    if (catalanPathsCache.has(n)) return catalanPathsCache.get(n);
    if (n === 0) {
      const result = [1n];
      catalanPathsCache.set(0, result);
      return result;
    }
    const prev = catalanpaths(n - 1);
    const r = (k) => k >= 0 && k < n ? prev[k] : 0n;
    const row = [...prev, 1n];
    for (let k = 0; k < n; k++) {
      row[k] = r(k - 1) + r(k + 1);
    }
    catalanPathsCache.set(n, row);
    return row;
  }
  var catalanPathsCache, CatalanPaths;
  var init_CatalanPaths = __esm({
    "CatalanPaths.ts"() {
      "use strict";
      init_tabltypes();
      catalanPathsCache = /* @__PURE__ */ new Map();
      CatalanPaths = new Table(
        catalanpaths,
        "CatalanPaths",
        ["A053121", "A052173", "A112554", "A322378"],
        "A049310",
        String.raw`\operatorname{is}(k = 0)\ ?\ 0 : \frac{k+1}{n+1} \binom{n+1}{(n-k)/2}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(CatalanPaths));
      }
    }
  });

  // Chains.ts
  function chains(n) {
    if (n === 0) return [1n];
    const cached = chainsCache.get(n);
    if (cached !== void 0) return cached;
    const ch = [...chains(n - 1), 0n];
    const row = [...ch];
    row[0] = 2n * ch[0];
    row[n] = BigInt(n) * ch[n - 1];
    for (let k = n - 1; k > 0; k--) {
      row[k] = BigInt(k) * ch[k - 1] + BigInt(k + 2) * ch[k];
    }
    chainsCache.set(n, row);
    return row;
  }
  var chainsCache, Chains;
  var init_Chains = __esm({
    "Chains.ts"() {
      "use strict";
      init_tabltypes();
      chainsCache = /* @__PURE__ */ new Map();
      Chains = new Table(
        chains,
        "Chains",
        ["A038719"],
        "",
        String.raw`\left({n+2 \brace k+2} -  {n+1 \brace k+2} \right)\, k!`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Chains));
      }
    }
  });

  // ChebyshevS.ts
  function chebyshevs(n) {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];
    const cached = chebyshevSCache.get(n);
    if (cached !== void 0) return cached;
    const rov = chebyshevs(n - 2);
    const row = [0n, ...chebyshevs(n - 1)];
    for (let k = 0; k < n - 1; k++) {
      row[k] -= rov[k];
    }
    chebyshevSCache.set(n, row);
    return row;
  }
  var chebyshevSCache, ChebyshevS;
  var init_ChebyshevS = __esm({
    "ChebyshevS.ts"() {
      "use strict";
      init_tabltypes();
      chebyshevSCache = /* @__PURE__ */ new Map();
      ChebyshevS = new Table(
        chebyshevs,
        "ChebyshevS",
        ["A049310", "A053119", "A112552", "A168561"],
        "A053121",
        String.raw`\binom{(n+k)/2}{k} \text{A369736}(n, k)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(ChebyshevS));
      }
    }
  });

  // ChebyshevT.ts
  function chebyshevt(n) {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];
    const cached = chebyshevTCache.get(n);
    if (cached !== void 0) return cached;
    const rov = chebyshevt(n - 2);
    const row = [0n, ...chebyshevt(n - 1)];
    row[n] = 2n * row[n];
    for (let k = 0; k < n - 1; k++) {
      row[k] = 2n * row[k] - rov[k];
    }
    chebyshevTCache.set(n, row);
    return row;
  }
  var chebyshevTCache, ChebyshevT;
  var init_ChebyshevT = __esm({
    "ChebyshevT.ts"() {
      "use strict";
      init_tabltypes();
      chebyshevTCache = /* @__PURE__ */ new Map();
      ChebyshevT = new Table(
        chebyshevt,
        "ChebyshevT",
        ["A053120", "A039991", "A081265"],
        "",
        String.raw`%%`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(ChebyshevT));
      }
    }
  });

  // ChebyshevU.ts
  function chebyshevu(n) {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 2n];
    const cached = chebyshevUCache.get(n);
    if (cached !== void 0) return cached;
    const rov = chebyshevu(n - 2);
    const row = [0n, ...chebyshevu(n - 1)];
    row[n] = 2n * row[n];
    for (let k = 0; k < n - 1; k++) {
      row[k] = 2n * row[k] - rov[k];
    }
    chebyshevUCache.set(n, row);
    return row;
  }
  var chebyshevUCache, ChebyshevU;
  var init_ChebyshevU = __esm({
    "ChebyshevU.ts"() {
      "use strict";
      init_tabltypes();
      chebyshevUCache = /* @__PURE__ */ new Map();
      ChebyshevU = new Table(
        chebyshevu,
        "ChebyshevU",
        ["A053117", "A053118", "A115322"],
        "",
        String.raw`2^k \binom{(n+k)/2}{k} \text{A369736}(n, k)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(ChebyshevU));
      }
    }
  });

  // CompositionLP.ts
  function clp(n, k) {
    if (k < 0 || k > n) return 0n;
    if (k === 0 || k === n) return 1n;
    const key = `${n},${k}`;
    const cached = clpCache.get(key);
    if (cached !== void 0) return cached;
    const result = 2n * clp(n - 1, k) + clp(n - 1, k - 1) - 2n * clp(n - 2, k - 1) + clp(n - k - 1, k - 1) - clp(n - k - 2, k);
    clpCache.set(key, result);
    return result;
  }
  function compositionlp(n) {
    if (n === 0) return [1n];
    const row = [];
    for (let k = 0; k <= n; k++) {
      row.push(clp(n - 1, k - 1));
    }
    return row;
  }
  var clpCache, CompositionLP;
  var init_CompositionLP = __esm({
    "CompositionLP.ts"() {
      "use strict";
      init_tabltypes();
      clpCache = /* @__PURE__ */ new Map();
      CompositionLP = new Table(
        compositionlp,
        "CompositionLP",
        ["A048004"],
        "A000000",
        String.raw`C_{LP}(n, k)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(CompositionLP));
      }
    }
  });

  // Delannoy.ts
  function delannoy(n) {
    if (n === 0) return [1n];
    if (n === 1) return [1n, 1n];
    const cached = delannoyCache.get(n);
    if (cached !== void 0) return cached;
    const prev1 = delannoy(n - 1);
    const prev2 = delannoy(n - 2);
    const middle = prev2.map((c, i) => prev1[i + 1] + prev1[i] + c);
    const result = [1n, ...middle, 1n];
    delannoyCache.set(n, result);
    return result;
  }
  var delannoyCache, Delannoy;
  var init_Delannoy = __esm({
    "Delannoy.ts"() {
      "use strict";
      init_tabltypes();
      delannoyCache = /* @__PURE__ */ new Map();
      Delannoy = new Table(
        delannoy,
        "Delannoy",
        ["A008288"],
        "A132372",
        String.raw`\text{Hyper}([-k, k - n], [1], 2)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Delannoy));
      }
    }
  });

  // DelannoyInv.ts
  function suffixSums(row) {
    const suffix = new Array(row.length).fill(0n);
    let total = 0n;
    for (let k = row.length - 1; k >= 0; k--) {
      total += row[k];
      suffix[k] = total;
    }
    return suffix;
  }
  function delannoyinv(n) {
    if (n === 0) return [1n];
    const cached = delannoyInvCache.get(n);
    if (cached !== void 0) return cached;
    const suffix = suffixSums(delannoyinv(n - 1));
    const middle = suffix.slice(0, -1).map((s, i) => s + suffix[i + 1]);
    const result = [suffix[0], ...middle, suffix[suffix.length - 1]];
    delannoyInvCache.set(n, result);
    return result;
  }
  var delannoyInvCache, DelannoyInv;
  var init_DelannoyInv = __esm({
    "DelannoyInv.ts"() {
      "use strict";
      init_tabltypes();
      delannoyInvCache = /* @__PURE__ */ new Map();
      DelannoyInv = new Table(
        delannoyinv,
        "DelannoyInv",
        ["A132372", "A103136", "A033878"],
        "A008288",
        String.raw`%%`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(DelannoyInv));
      }
    }
  });

  // Divisibility.ts
  function divisibility(n) {
    if (n === 0) return [1n];
    const row = new Array(n + 1).fill(0n);
    row[1] = row[n] = 1n;
    let i = 2;
    let div = n;
    while (i < div) {
      div = Math.floor(n / i);
      if (n % i === 0) {
        row[i] = 1n;
        row[div] = 1n;
      }
      i++;
    }
    return row;
  }
  var Divisibility;
  var init_Divisibility = __esm({
    "Divisibility.ts"() {
      "use strict";
      init_tabltypes();
      Divisibility = new Table(
        divisibility,
        "Divisibility",
        ["A113704", "A051731"],
        "A000000",
        String.raw`[n=0 \text{ or } k \text{ divides } n]`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Divisibility));
      }
    }
  });

  // DyckPaths.ts
  function dyckpaths(n) {
    if (n === 0) return [1n];
    const cached = dyckPathsCache.get(n);
    if (cached !== void 0) return cached;
    const prev = [...dyckpaths(n - 1), 0n];
    const middle = Array.from(
      { length: n - 1 },
      (_, i) => prev[i] + 2n * prev[i + 1] + prev[i + 2]
    );
    const result = [prev[0] + prev[1], ...middle, 1n];
    dyckPathsCache.set(n, result);
    return result;
  }
  var dyckPathsCache, DyckPaths;
  var init_DyckPaths = __esm({
    "DyckPaths.ts"() {
      "use strict";
      init_tabltypes();
      dyckPathsCache = /* @__PURE__ */ new Map();
      DyckPaths = new Table(
        dyckpaths,
        "DyckPaths",
        ["A039599", "A050155"],
        "A000000",
        String.raw`\binom{2n}{n - k} (2k + 1) / (n + k + 1)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(DyckPaths));
      }
    }
  });

  // DyckPathsInv.ts
  function dyckpathsinv(n) {
    if (dyckPathsInvCache.has(n)) return dyckPathsInvCache.get(n);
    if (n === 0) {
      dyckPathsInvCache.set(0, [1n]);
      return [1n];
    }
    if (n === 1) {
      dyckPathsInvCache.set(1, [1n, 1n]);
      return [1n, 1n];
    }
    const q = [...dyckpathsinv(n - 2), 0n];
    const p = [...dyckpathsinv(n - 1), 0n];
    const row = [...p];
    row[n] = 1n;
    for (let k = n - 1; k >= 1; k--) {
      row[k] = p[k - 1] + 2n * p[k] - q[k];
    }
    dyckPathsInvCache.set(n, row);
    return row;
  }
  var dyckPathsInvCache, DyckPathsInv;
  var init_DyckPathsInv = __esm({
    "DyckPathsInv.ts"() {
      "use strict";
      init_tabltypes();
      dyckPathsInvCache = /* @__PURE__ */ new Map();
      DyckPathsInv = new Table(
        dyckpathsinv,
        "DyckPathsInv",
        ["A085478", "A129818", "A123970"],
        "A039599",
        String.raw`\binom{n+k}{2k}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(DyckPathsInv));
      }
    }
  });

  // Entringer.ts
  function entringer(n) {
    if (n === 0) return [1n];
    const cached = entringerCache.get(n);
    if (cached !== void 0) return cached;
    const prev = entringer(n - 1);
    const row = new Array(n + 1);
    row[0] = 0n;
    let acc = 0n;
    for (let i = n - 1; i >= 0; i--) {
      acc += prev[i];
      row[n - i] = acc;
    }
    entringerCache.set(n, row);
    return row;
  }
  var entringerCache, Entringer;
  var init_Entringer = __esm({
    "Entringer.ts"() {
      "use strict";
      init_tabltypes();
      entringerCache = /* @__PURE__ */ new Map();
      Entringer = new Table(
        entringer,
        "Entringer",
        ["A008281", "A008282", "A010094"],
        "",
        String.raw`is(k=0) \ ? \ 0^n : T(n, k-1) + T(n-1, n-k)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Entringer));
      }
    }
  });

  // Euler.ts
  function euler(n) {
    if (n === 0) return [1n];
    const cached = eulerCache.get(n);
    if (cached !== void 0) return cached;
    const row = [...euler(n - 1), 1n];
    const N = BigInt(n);
    for (let k = n; k > 0; k--) {
      row[k] = row[k - 1] * N / BigInt(k);
    }
    let a = 0n, b = 0n;
    for (let j = n; j > 0; j -= 4) a += row[j];
    for (let j = n - 2; j > 0; j -= 4) b += row[j];
    row[0] = (n >> 1) % 2 === 0 ? b - a : a - b;
    eulerCache.set(n, row);
    return row;
  }
  var eulerCache, Euler;
  var init_Euler = __esm({
    "Euler.ts"() {
      "use strict";
      init_tabltypes();
      eulerCache = /* @__PURE__ */ new Map();
      Euler = new Table(
        euler,
        "Euler",
        ["A363394", "A247453", "A109449"],
        "A000000",
        String.raw`\binom{n}{k} 2^{n-k} \text{Euler}_{n-k}(1/2)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Euler));
      }
    }
  });

  // Eulerian.ts
  function eulerian(n) {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];
    const cached = eulerianCache.get(n);
    if (cached !== void 0) return cached;
    const row = [...eulerian(n - 1), 1n];
    for (let k = n - 1; k >= 1; k--) {
      row[k] = BigInt(n - k + 1) * row[k - 1] + BigInt(k) * row[k];
    }
    eulerianCache.set(n, row);
    return row;
  }
  var eulerianCache, Eulerian;
  var init_Eulerian = __esm({
    "Eulerian.ts"() {
      "use strict";
      init_tabltypes();
      eulerianCache = /* @__PURE__ */ new Map();
      Eulerian = new Table(
        eulerian,
        "Eulerian",
        ["A173018", "A123125", "A008292"],
        "A055325",
        String.raw`\sum_{j=0}^{k} (-1)^{j} \binom{n+1}{j} (k+1-j)^{n}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Eulerian));
      }
    }
  });

  // EulerSec.ts
  function eulersec(n) {
    if (n === 0) return [1n];
    const cached = eulerSecCache.get(n);
    if (cached !== void 0) return cached;
    const b = binomial(n);
    const row = new Array(n + 1).fill(0n);
    for (let k = 1; k <= n; k++) {
      row[k] = b[k] * eulersec(n - k)[0];
    }
    if (n % 2 === 0) {
      let s = 0n;
      for (let k = 2; k <= n; k += 2) s += row[k];
      row[0] = -s;
    }
    eulerSecCache.set(n, row);
    return row;
  }
  var eulerSecCache, EulerSec;
  var init_EulerSec = __esm({
    "EulerSec.ts"() {
      "use strict";
      init_tabltypes();
      init_Binomial();
      eulerSecCache = /* @__PURE__ */ new Map();
      EulerSec = new Table(
        eulersec,
        "EulerSec",
        ["A119879", "A081658", "A153641"],
        "A000000",
        String.raw`\binom{n}{k}\, 2^{n-k}\ \text{Euler} (n-k, 1/2)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(EulerSec));
      }
    }
  });

  // EulerTan.ts
  function eulertan(n) {
    const cached = eulerTanCache.get(n);
    if (cached !== void 0) return cached;
    const b = binomial(n);
    const row = new Array(n + 1).fill(0n);
    for (let k = 1; k <= n; k++) {
      row[k] = b[k] * eulertan(n - k)[0];
    }
    if (n % 2 === 1) {
      let s = 0n;
      for (let k = 2; k <= n; k += 2) s += row[k];
      row[0] = -s + 1n;
    }
    eulerTanCache.set(n, row);
    return row;
  }
  var eulerTanCache, EulerTan;
  var init_EulerTan = __esm({
    "EulerTan.ts"() {
      "use strict";
      init_tabltypes();
      init_Binomial();
      eulerTanCache = /* @__PURE__ */ new Map();
      EulerTan = new Table(
        eulertan,
        "EulerTan",
        ["A162660", "A350972", "A155585", "A009006", "A000182"],
        "",
        String.raw`[x^k]( -x^n + \sum_{k=0}^{n} \binom{n}{k} \text{Euler}(k) (x+1)^{n - k})`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(EulerTan));
      }
    }
  });

  // FallingFactorial.ts
  function fallingfactorial(n) {
    if (fallingFactorialCache.has(n)) return fallingFactorialCache.get(n);
    if (n === 0) {
      const result = [1n];
      fallingFactorialCache.set(0, result);
      return result;
    }
    const r = fallingfactorial(n - 1);
    const bn = BigInt(n);
    const row = new Array(n + 1);
    row[0] = bn * r[n - 1];
    for (let k = 0; k < n; k++) {
      row[k + 1] = bn * r[k];
    }
    row[0] = 1n;
    fallingFactorialCache.set(n, row);
    return row;
  }
  var fallingFactorialCache, FallingFactorial;
  var init_FallingFactorial = __esm({
    "FallingFactorial.ts"() {
      "use strict";
      init_tabltypes();
      fallingFactorialCache = /* @__PURE__ */ new Map();
      FallingFactorial = new Table(
        fallingfactorial,
        "FallingFactorial",
        ["A008279", "A068424", "A094587", "A173333", "A181511"],
        "",
        String.raw`n! / (n - k)!`
      );
    }
  });

  // Fibonacci.ts
  function fibonacci(n) {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];
    const cached = fibonacciCache.get(n);
    if (cached !== void 0) return cached;
    const row = [...fibonacci(n - 1), 1n];
    const s = row[1];
    for (let k = n - 1; k > 0; k--) {
      row[k] += row[k - 1];
    }
    row[0] = s;
    fibonacciCache.set(n, row);
    return row;
  }
  var fibonacciCache, Fibonacci;
  var init_Fibonacci = __esm({
    "Fibonacci.ts"() {
      "use strict";
      init_tabltypes();
      fibonacciCache = /* @__PURE__ */ new Map();
      Fibonacci = new Table(
        fibonacci,
        "Fibonacci",
        ["A354267", "A105809", "A228074"],
        "A000000",
        String.raw`T(n-1, k-1) + T(n-1, k)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Fibonacci));
      }
    }
  });

  // Fubini.ts
  function fubini(n) {
    if (fubiniCache.has(n)) return fubiniCache.get(n);
    if (n === 0) {
      fubiniCache.set(0, [1n]);
      return [1n];
    }
    const prev = fubini(n - 1);
    const r = (k) => k <= n - 1 ? prev[k] : 0n;
    const row = [0n, ...prev];
    for (let k = 1; k <= n; k++) {
      row[k] = BigInt(k) * (r(k - 1) + r(k));
    }
    fubiniCache.set(n, row);
    return row;
  }
  var fubiniCache, Fubini;
  var init_Fubini = __esm({
    "Fubini.ts"() {
      "use strict";
      init_tabltypes();
      fubiniCache = /* @__PURE__ */ new Map();
      Fubini = new Table(
        fubini,
        "Fubini",
        ["A131689", "A019538", "A090582", "A278075"],
        "",
        String.raw`k! \ {n \brace k}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Fubini));
      }
    }
  });

  // Gaussq2.ts
  function gaussq2(n) {
    if (n === 0) return [1n];
    const cached = gaussq2Cache.get(n);
    if (cached !== void 0) return cached;
    const prev = gaussq2(n - 1);
    const row = [1n, ...prev];
    let p = 2n;
    for (let k = 1; k < n; k++) {
      row[k] = prev[k - 1] + p * prev[k];
      p *= 2n;
    }
    gaussq2Cache.set(n, row);
    return row;
  }
  var gaussq2Cache, Gaussq2;
  var init_Gaussq2 = __esm({
    "Gaussq2.ts"() {
      "use strict";
      init_tabltypes();
      gaussq2Cache = /* @__PURE__ */ new Map();
      Gaussq2 = new Table(
        gaussq2,
        "Gaussq2",
        ["A022166"],
        "A000000",
        String.raw`\prod_{i=k+1}^{n} (2^i - 1) \ / \ \prod_{i=1}^{n-k} (2^i - 1)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Gaussq2));
      }
    }
  });

  // Genocchi.ts
  function genocchi(n) {
    if (n === 0) return [1n];
    const cached = genocchiCache.get(n);
    if (cached !== void 0) return cached;
    const row = [0n, ...genocchi(n - 1), 0n];
    for (let k = n; k > 0; k--) {
      row[k] += row[k + 1];
    }
    for (let k = 2; k < n + 2; k++) {
      row[k] += row[k - 1];
    }
    const result = row.slice(1);
    genocchiCache.set(n, result);
    return result;
  }
  var genocchiCache, Genocchi;
  var init_Genocchi = __esm({
    "Genocchi.ts"() {
      "use strict";
      init_tabltypes();
      genocchiCache = /* @__PURE__ */ new Map();
      Genocchi = new Table(
        genocchi,
        "Genocchi",
        ["A297703"],
        "",
        String.raw`%%`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Genocchi));
      }
    }
  });

  // Laguerre.ts
  function laguerre(n) {
    if (n === 0) return [1n];
    const cached = laguerreCache.get(n);
    if (cached !== void 0) return cached;
    const row = [0n, ...laguerre(n - 1)];
    for (let k = 0; k < n; k++) {
      row[k] += BigInt(n + k) * row[k + 1];
    }
    laguerreCache.set(n, row);
    return row;
  }
  var laguerreCache, Laguerre;
  var init_Laguerre = __esm({
    "Laguerre.ts"() {
      "use strict";
      init_tabltypes();
      laguerreCache = /* @__PURE__ */ new Map();
      Laguerre = new Table(
        laguerre,
        "Laguerre",
        ["A021009", "A021010", "A144084"],
        "A000000",
        String.raw`\binom{n}{k}\, \frac{n!}{k!}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Laguerre));
      }
    }
  });

  // Lah.ts
  function lah(n) {
    if (lahCache.has(n)) return lahCache.get(n);
    if (n === 0) {
      const result = [1n];
      lahCache.set(0, result);
      return result;
    }
    const row = [...lah(n - 1), 1n];
    row[0] = 0n;
    for (let k = n - 1; k >= 1; k--) {
      row[k] = row[k] * BigInt(n + k - 1) + row[k - 1];
    }
    lahCache.set(n, row);
    return row;
  }
  var lahCache, Lah;
  var init_Lah = __esm({
    "Lah.ts"() {
      "use strict";
      init_tabltypes();
      lahCache = /* @__PURE__ */ new Map();
      Lah = new Table(
        lah,
        "Lah",
        ["A271703", "A008297", "A066667", "A089231", "A105278", "A111596"],
        "A111596",
        String.raw`\binom{n}{k} \text{FallingFactorial}(n-1, n-k)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Lah));
      }
    }
  });

  // Lehmer.ts
  function _t(n, k, m) {
    if (k < 0 || n < 0) return 0n;
    if (k === 0) return 1n;
    const key = `${n},${k},${m}`;
    const cached = tCache.get(key);
    if (cached !== void 0) return cached;
    const result = BigInt(m) * _t(n, k - 1, m) + _t(n - 1, k, m + 1);
    tCache.set(key, result);
    return result;
  }
  function lehmer(n) {
    if (n === 0) return [1n];
    return Array.from(
      { length: n + 1 },
      (_, k) => k === n ? 1n : _t(k - 1, n - k, n - k)
    );
  }
  var tCache, Lehmer;
  var init_Lehmer = __esm({
    "Lehmer.ts"() {
      "use strict";
      init_tabltypes();
      tCache = /* @__PURE__ */ new Map();
      Lehmer = new Table(
        lehmer,
        "Lehmer",
        ["A354794", "A039621"],
        "A000000",
        String.raw`is(n = k)\ ? \ 1 : \sum_{j=0}^{k-1} (-1)^{j}(n-j-1)^{n-1}/(j! (k-1-j)!)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Lehmer));
      }
    }
  });

  // Leibniz.ts
  function leibniz(n) {
    if (n === 0) return [1n];
    const cached = leibnizCache.get(n);
    if (cached !== void 0) return cached;
    const row = new Array(n + 1).fill(0n);
    row[0] = row[n] = BigInt(n + 1);
    for (let k = 1; k < n; k++) {
      row[k] = BigInt(n - k + 1) * row[k - 1] / BigInt(k);
    }
    leibnizCache.set(n, row);
    return row;
  }
  var leibnizCache, Leibniz;
  var init_Leibniz = __esm({
    "Leibniz.ts"() {
      "use strict";
      init_tabltypes();
      leibnizCache = /* @__PURE__ */ new Map();
      Leibniz = new Table(
        leibniz,
        "Leibniz",
        ["A003506"],
        "",
        String.raw`(k+1) \, \binom{n+1}{k+1}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Leibniz));
      }
    }
  });

  // Lucas.ts
  function lucas(n) {
    if (lucasCache.has(n)) return lucasCache.get(n);
    if (n === 0) {
      lucasCache.set(0, [2n]);
      return [2n];
    }
    if (n === 1) {
      lucasCache.set(1, [1n, 2n]);
      return [1n, 2n];
    }
    const row = [...lucas(n - 1), 0n];
    for (let k = n; k >= 1; k--) {
      row[k] += row[k - 1];
    }
    lucasCache.set(n, row);
    return row;
  }
  var lucasCache, Lucas;
  var init_Lucas = __esm({
    "Lucas.ts"() {
      "use strict";
      init_tabltypes();
      lucasCache = /* @__PURE__ */ new Map();
      Lucas = new Table(
        lucas,
        "Lucas",
        ["A029635", "A029653"],
        "",
        String.raw`\binom{n}{k} + \binom{n-1}{k-1}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Lucas));
      }
    }
  });

  // Moebius.ts
  function moebiusVal(n) {
    if (n === 1) return 1n;
    if (n === 2) return -1n;
    const cached = moebiusValCache.get(n);
    if (cached !== void 0) return cached;
    const divRow = divisibility(n);
    let s = 0n;
    for (let k = 1; k < n - 1; k++) {
      if (divRow[k] !== 0n) s += moebiusVal(k);
    }
    const result = -s;
    moebiusValCache.set(n, result);
    return result;
  }
  function moebius(n) {
    if (n === 0) return [1n];
    const row = new Array(n + 1).fill(0n);
    row[n] = 1n;
    for (let k = 1; k < n; k++) {
      if (n % k === 0) {
        row[k] = moebiusVal(n / k);
      }
    }
    return row;
  }
  var moebiusValCache, Moebius;
  var init_Moebius = __esm({
    "Moebius.ts"() {
      "use strict";
      init_tabltypes();
      init_Divisibility();
      moebiusValCache = /* @__PURE__ */ new Map();
      Moebius = new Table(
        moebius,
        "Moebius",
        ["A363914", "A054525"],
        "A000000",
        String.raw`M^{-1}(n, k); M(n, k) = [k \le n \ \& \ k | n]`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Moebius));
      }
    }
  });

  // Monotone.ts
  function monotone(n) {
    if (n === 0) return [1n];
    const cached = monotoneCache.get(n);
    if (cached !== void 0) return cached;
    const row = Array(n + 1).fill(1n);
    row[1] = BigInt(n);
    for (let k = 1; k < n; k++) {
      row[k + 1] = row[k] * BigInt(n + k) / BigInt(k + 1);
    }
    monotoneCache.set(n, row);
    return row;
  }
  var monotoneCache, Monotone;
  var init_Monotone = __esm({
    "Monotone.ts"() {
      "use strict";
      init_tabltypes();
      monotoneCache = /* @__PURE__ */ new Map();
      Monotone = new Table(
        monotone,
        "Monotone",
        ["A059481", "A027555"],
        "",
        String.raw`\binom{n+k-1}{k}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Monotone));
      }
    }
  });

  // Motzkin.ts
  function motzkin(n) {
    if (n === 0) return [1n];
    const cached = motzkinCache.get(n);
    if (cached !== void 0) return cached;
    const prev = motzkin(n - 1);
    const r = [...prev, 0n];
    const row = [...prev, 1n];
    row[0] += r[1];
    for (let k = 1; k < n; k++) {
      row[k] += r[k - 1] + r[k + 1];
    }
    motzkinCache.set(n, row);
    return row;
  }
  var motzkinCache, Motzkin;
  var init_Motzkin = __esm({
    "Motzkin.ts"() {
      "use strict";
      init_tabltypes();
      motzkinCache = /* @__PURE__ */ new Map();
      Motzkin = new Table(
        motzkin,
        "Motzkin",
        ["A064189", "A026300", "A009766", "A122896"],
        "A000000",
        String.raw`\binom{n}{k} \text{Hyper}([(k-n)/2, (k-n+1)/2], [k+2], 4)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Motzkin));
      }
    }
  });

  // Narayana.ts
  function narayana(n) {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];
    const cached = narayanaCache.get(n);
    if (cached !== void 0) return cached;
    const row = [...narayana(n - 1), 1n];
    for (let k = n - 1; k >= 1; k--) {
      row[k] += BigInt(2 * n - k) * row[k - 1] / BigInt(k);
    }
    narayanaCache.set(n, row);
    return row;
  }
  var narayanaCache, Narayana;
  var init_Narayana = __esm({
    "Narayana.ts"() {
      "use strict";
      init_tabltypes();
      narayanaCache = /* @__PURE__ */ new Map();
      Narayana = new Table(
        narayana,
        "Narayana",
        ["A090181", "A001263", "A131198"],
        "A103364",
        String.raw`\binom{n}{n-k} \binom{n-1}{n-k} \frac{1}{n-k+1}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Narayana));
      }
    }
  });

  // Nicomachus.ts
  function nicomachus(n) {
    if (n === 0) return [1n];
    const cached = nicomachusCache.get(n);
    if (cached !== void 0) return cached;
    const prev = nicomachus(n - 1);
    const row = [...prev, 3n * prev[n - 1]];
    for (let k = 0; k < n; k++) {
      row[k] *= 2n;
    }
    nicomachusCache.set(n, row);
    return row;
  }
  var nicomachusCache, Nicomachus;
  var init_Nicomachus = __esm({
    "Nicomachus.ts"() {
      "use strict";
      init_tabltypes();
      nicomachusCache = /* @__PURE__ */ new Map();
      Nicomachus = new Table(
        nicomachus,
        "Nicomachus",
        ["A036561", "A081954", "A175840"],
        "",
        String.raw`2^{n - k}\, 3^{k}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Nicomachus));
      }
    }
  });

  // Parades.ts
  function A(n, k) {
    if (n === 0) return k === 0 ? 1n : 0n;
    if (k > n) {
      [n, k] = [k, n];
    }
    const key = `${n},${k}`;
    const cached = ACache.get(key);
    if (cached !== void 0) return cached;
    const b = binomial(k + 1);
    let s = 0n;
    for (let j = 1; j <= k; j++) {
      s += b[j + 1] * A(n - 1, k - j);
    }
    const result = s + BigInt(k) * A(n - 1, k);
    ACache.set(key, result);
    return result;
  }
  function parades(n) {
    const cached = paradesCache.get(n);
    if (cached !== void 0) return cached;
    const half = Math.floor((n + 2) / 2);
    const row = [];
    for (let k = 0; k < half; k++) {
      row.push(A(n - k, k));
    }
    const result = n % 2 === 0 ? [...row, ...row.slice(0, -1).reverse()] : [...row, ...[...row].reverse()];
    paradesCache.set(n, result);
    return result;
  }
  var ACache, paradesCache, Parades;
  var init_Parades = __esm({
    "Parades.ts"() {
      "use strict";
      init_tabltypes();
      init_Binomial();
      ACache = /* @__PURE__ */ new Map();
      paradesCache = /* @__PURE__ */ new Map();
      Parades = new Table(
        parades,
        "Parades",
        ["A371761", "A272644"],
        "",
        String.raw`\sum_{j=0}^{k} \, {n - k \brace j} \, {k \brace j} \, (j!)^2`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Parades));
      }
    }
  });

  // Partition.ts
  function part(n, k) {
    if (k < 0 || n < 0) return 0n;
    if (k === 0) return n === 0 ? 1n : 0n;
    const row = partCache.get(n);
    if (row !== void 0) {
      const cached = row.get(k);
      if (cached !== void 0) return cached;
    }
    const result = part(n - 1, k - 1) + part(n - k, k);
    if (!partCache.has(n)) partCache.set(n, /* @__PURE__ */ new Map());
    partCache.get(n).set(k, result);
    return result;
  }
  function partition(n) {
    return Array.from({ length: n + 1 }, (_, k) => part(n, k));
  }
  var partCache, Partition;
  var init_Partition = __esm({
    "Partition.ts"() {
      "use strict";
      init_tabltypes();
      partCache = /* @__PURE__ */ new Map();
      Partition = new Table(
        partition,
        "Partition",
        ["A072233", "A008284", "A058398"],
        "A000000",
        String.raw`T_{n - 1, k - 1} + T_{n - k, k}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Partition));
      }
    }
  });

  // Powers.ts
  function powers(n) {
    if (n === 0) return [1n];
    const cached = powersCache.get(n);
    if (cached !== void 0) return cached;
    const lrow = powers(n - 1);
    const result = [...Array.from({ length: n }, (_, k) => BigInt(k) * lrow[k]), 1n];
    powersCache.set(n, result);
    return result;
  }
  var powersCache, Powers;
  var init_Powers = __esm({
    "Powers.ts"() {
      "use strict";
      init_tabltypes();
      powersCache = /* @__PURE__ */ new Map();
      Powers = new Table(
        powers,
        "Powers",
        ["A004248", "A009998", "A051129"],
        "A000000",
        String.raw`k^{n - k}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Powers));
      }
    }
  });

  // PowLaguerre.ts
  function powlaguerre(n) {
    if (n === 0) return [1n];
    const cached = powlaguerreCache.get(n);
    if (cached !== void 0) return cached;
    const row = [...powlaguerre(n - 1), 1n];
    const val = row[0] * BigInt(n);
    row[0] = val;
    row[n] = val;
    for (let k = 1; k < n; k++) {
      row[k] = BigInt(n - k + 1) * row[k - 1] / BigInt(k);
    }
    powlaguerreCache.set(n, row);
    return row;
  }
  var powlaguerreCache, PowLaguerre;
  var init_PowLaguerre = __esm({
    "PowLaguerre.ts"() {
      "use strict";
      init_tabltypes();
      powlaguerreCache = /* @__PURE__ */ new Map();
      PowLaguerre = new Table(
        powlaguerre,
        "PowLaguerre",
        ["A196347", "A021012"],
        "",
        String.raw`n! \binom{n}{k}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(PowLaguerre));
      }
    }
  });

  // Rencontres.ts
  function rencontres(n) {
    if (rencontresCache.has(n)) return rencontresCache.get(n);
    if (n === 0) {
      const result = [1n];
      rencontresCache.set(0, result);
      return result;
    }
    if (n === 1) {
      const result = [0n, 1n];
      rencontresCache.set(1, result);
      return result;
    }
    const prev1 = rencontres(n - 1);
    const prev2 = rencontres(n - 2);
    const row = [BigInt(n - 1) * (prev1[0] + prev2[0]), ...prev1];
    for (let k = 1; k < n - 1; k++) {
      row[k] = BigInt(n) * row[k] / BigInt(k);
    }
    rencontresCache.set(n, row);
    return row;
  }
  var rencontresCache, Rencontres;
  var init_Rencontres = __esm({
    "Rencontres.ts"() {
      "use strict";
      init_tabltypes();
      rencontresCache = /* @__PURE__ */ new Map();
      Rencontres = new Table(
        rencontres,
        "Rencontres",
        ["A008290", "A098825"],
        "A055137",
        String.raw`\binom{n}{k} \operatorname{derangements}(n - k)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Rencontres));
      }
    }
  });

  // RisingFactorial.ts
  function risingfactorial(n) {
    if (n === 0) return [1n];
    const cached = risingFactorialCache.get(n);
    if (cached !== void 0) return cached;
    const row = new Array(n + 1).fill(1n);
    row[1] = BigInt(n);
    for (let k = 1; k < n; k++) {
      row[k + 1] = row[k] * BigInt(n + k);
    }
    risingFactorialCache.set(n, row);
    return row;
  }
  var risingFactorialCache, RisingFactorial;
  var init_RisingFactorial = __esm({
    "RisingFactorial.ts"() {
      "use strict";
      init_tabltypes();
      risingFactorialCache = /* @__PURE__ */ new Map();
      RisingFactorial = new Table(
        risingfactorial,
        "RisingFactorial",
        ["A124320"],
        "",
        String.raw`k! \binom{n+k-1}{k}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(RisingFactorial));
      }
    }
  });

  // Schroeder.ts
  function schroeder(n) {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];
    const cached = schroederCache.get(n);
    if (cached !== void 0) return cached;
    const row = [...schroeder(n - 1), 1n];
    for (let k = n - 1; k >= 1; k--) {
      row[k] += row[k - 1] + row[k + 1];
    }
    schroederCache.set(n, row);
    return row;
  }
  var schroederCache, Schroeder;
  var init_Schroeder = __esm({
    "Schroeder.ts"() {
      "use strict";
      init_tabltypes();
      schroederCache = /* @__PURE__ */ new Map();
      Schroeder = new Table(
        schroeder,
        "Schroeder",
        ["A122538", "A033877", "A080245", "A080247", "A106579"],
        "A122542",
        String.raw`\text{is}(k=0)\,?\,0^{n} : T(n-1,k-1)+T(n-1,k)+T(n,k+1)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Schroeder));
      }
    }
  });

  // Sierpinski.ts
  function sierpinski(n) {
    return Array.from({ length: n + 1 }, (_, k) => (~n & k) === 0 ? 1n : 0n);
  }
  var Sierpinski;
  var init_Sierpinski = __esm({
    "Sierpinski.ts"() {
      "use strict";
      init_tabltypes();
      Sierpinski = new Table(
        sierpinski,
        "Sierpinski",
        ["A047999", "A090971", "A114700", "A143200", "A166282"],
        "A000000",
        String.raw`\binom{n}{k} \text{ mod } 2`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Sierpinski));
      }
    }
  });

  // StirlingCycle.ts
  function stirlingcycle(n) {
    if (stirlingCycleCache.has(n)) return stirlingCycleCache.get(n);
    if (n === 0) {
      const result = [1n];
      stirlingCycleCache.set(0, result);
      return result;
    }
    const prev = stirlingcycle(n - 1);
    const row = [0n, ...prev];
    const bn1 = BigInt(n - 1);
    for (let k = 1; k < n; k++) {
      row[k] = row[k] + bn1 * row[k + 1];
    }
    stirlingCycleCache.set(n, row);
    return row;
  }
  var stirlingCycleCache, StirlingCycle;
  var init_StirlingCycle = __esm({
    "StirlingCycle.ts"() {
      "use strict";
      init_tabltypes();
      stirlingCycleCache = /* @__PURE__ */ new Map();
      StirlingCycle = new Table(
        stirlingcycle,
        "StirlingCycle",
        ["A132393", "A008275", "A008276", "A048994", "A054654", "A094638", "A130534"],
        "A000000",
        String.raw`{n \brack k}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(StirlingCycle));
      }
    }
  });

  // StirlingSet.ts
  function stirlingset(n) {
    if (stirlingSetCache.has(n)) return stirlingSetCache.get(n);
    if (n === 0) {
      const result = [1n];
      stirlingSetCache.set(0, result);
      return result;
    }
    const prev = stirlingset(n - 1);
    const row = [0n, ...prev];
    for (let k = 1; k < n; k++) {
      row[k] = row[k] + BigInt(k) * row[k + 1];
    }
    stirlingSetCache.set(n, row);
    return row;
  }
  var stirlingSetCache, StirlingSet;
  var init_StirlingSet = __esm({
    "StirlingSet.ts"() {
      "use strict";
      init_tabltypes();
      stirlingSetCache = /* @__PURE__ */ new Map();
      StirlingSet = new Table(
        stirlingset,
        "StirlingSet",
        [
          "A048993",
          "A008277",
          "A008278",
          "A080417",
          "A106800",
          "A151511",
          "A151512",
          "A154959",
          "A213735"
        ],
        "A132393",
        String.raw`{n \brace k}`
      );
    }
  });

  // TernaryTrees.ts
  function ternarytrees(n) {
    if (n === 0) return [1n];
    if (n === 1) return [0n, 1n];
    const cached = ternaryTreesCache.get(n);
    if (cached !== void 0) return cached;
    const prev = ternarytrees(n - 1);
    const row = [...prev, prev[n - 1]];
    let s = 0n, a = 0n;
    for (let i = 0; i < row.length; i++) {
      s += row[i];
      a += s;
      row[i] = a;
    }
    ternaryTreesCache.set(n, row);
    return row;
  }
  var ternaryTreesCache, TernaryTrees;
  var init_TernaryTrees = __esm({
    "TernaryTrees.ts"() {
      "use strict";
      init_tabltypes();
      ternaryTreesCache = /* @__PURE__ */ new Map();
      TernaryTrees = new Table(
        ternarytrees,
        "TernaryTrees",
        ["A355172"],
        "",
        String.raw`is(k=0)\, ?\, 0^n : \frac{(2n-2k+3) \, (2n+k-1)!}{(2n+1)! \, (k-1)!}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(TernaryTrees));
      }
    }
  });

  // UpDownWords.ts
  function updownwords(n) {
    if (n === 0) return [1n];
    const cached = updownwordsCache.get(n);
    if (cached !== void 0) return cached;
    const row = new Array(n + 1).fill(1n);
    for (let k = 1; k < n; k++) {
      const a = Math.floor((n - k - 1) / 2) + 1;
      const prev = updownwords(n - 1)[k - 1];
      let s = 0n;
      for (let j = 0; j < a; j++) {
        s += updownwords(2 * j + k - 1)[k - 1] * updownwords(n - 1 - 2 * j)[k];
      }
      row[k] = prev + s;
    }
    updownwordsCache.set(n, row);
    return row;
  }
  var updownwordsCache, UpDownWords;
  var init_UpDownWords = __esm({
    "UpDownWords.ts"() {
      "use strict";
      init_tabltypes();
      updownwordsCache = /* @__PURE__ */ new Map();
      UpDownWords = new Table(
        updownwords,
        "UpDownWords",
        ["A050446", "A050447"],
        "A000000",
        String.raw``
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(UpDownWords));
      }
    }
  });

  // Worpitzky.ts
  function worpitzky(n) {
    if (worpitzkyCache.has(n)) return worpitzkyCache.get(n);
    if (n === 0) {
      const result = [1n];
      worpitzkyCache.set(0, result);
      return result;
    }
    const row = [...worpitzky(n - 1), 0n];
    for (let k = n; k >= 1; k--) {
      row[k] = BigInt(k) * row[k - 1] + BigInt(k + 1) * row[k];
    }
    worpitzkyCache.set(n, row);
    return row;
  }
  var worpitzkyCache, Worpitzky;
  var init_Worpitzky = __esm({
    "Worpitzky.ts"() {
      "use strict";
      init_tabltypes();
      worpitzkyCache = /* @__PURE__ */ new Map();
      Worpitzky = new Table(
        worpitzky,
        "Worpitzky",
        ["A028246", "A053440", "A075263", "A130850", "A163626"],
        "",
        String.raw`\sum_{j=0}^{n} \text{Eulerian}(n, j) \binom{n-j}{n-k}`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Worpitzky));
      }
    }
  });

  // Tests.ts
  var Tests_exports = {};
  __export(Tests_exports, {
    TestTable: () => TestTable
  });
  function section(title) {
    console.log("\n" + "\u2500".repeat(60));
    console.log(" " + title);
    console.log("\u2500".repeat(60));
  }
  function check(label, actual, expected) {
    const pass = JSON.stringify(actual, bigintReplacer) === JSON.stringify(expected, bigintReplacer);
    const mark = pass ? "\u2713" : "\u2717";
    console.log(`  ${mark}  ${label}`);
    if (!pass) {
      console.log(`       expected: ${JSON.stringify(expected, bigintReplacer)}`);
      console.log(`       actual  : ${JSON.stringify(actual, bigintReplacer)}`);
    }
  }
  function TestTable(T, size = 7) {
    section(`[${T.id}]  Triangle \u2014 show(${size + 2})`);
    T.show(size + 2);
    section(`[${T.id}]  Triangle \u2014 show(${size - 1}, total = true)`);
    T.show(size - 1, true);
    section(`[${T.id}]  Array form \u2014 showarray(${size - 1})`);
    T.showarray(size - 1);
    section(`[${T.id}]  row(n)`);
    for (let n = 0; n <= Math.min(size, 5); n++) {
      console.log(`  row(${n}) = [${T.row(n).join(", ")}]`);
    }
    section(`[${T.id}]  val(n, k) \u2014 val(n, k) === row(n)[k]`);
    for (let n = 0; n <= Math.min(size, 4); n++) {
      for (let k = 0; k <= n; k++) {
        check(
          `val(${n}, ${k}) === row(${n})[${k}]`,
          T.val(n, k),
          T.row(n)[k]
        );
      }
    }
    section(`[${T.id}]  tab(${size}) \u2014 tab(size)[n] === row(n)`);
    const tbl = T.tab(size);
    for (let n = 0; n < size; n++) {
      check(`tab(${size})[${n}] === row(${n})`, tbl[n], T.row(n));
    }
    section(`[${T.id}]  mat(${size}) \u2014 lower-triangular`);
    const m = T.mat(size);
    for (const row of m) console.log("  [" + row.join(", ") + "]");
    let matOk = true;
    for (let n = 0; n < size && matOk; n++) {
      for (let k = n + 1; k < size; k++) {
        if (m[n][k] !== 0n) {
          matOk = false;
          break;
        }
      }
    }
    check(`mat(${size}) zeros above diagonal`, matOk, true);
    for (let n = 0; n < size; n++) {
      check(`mat(${size})[${n}][${n}] === val(${n}, ${n})`, m[n][n], T.val(n, n));
    }
    section(`[${T.id}]  rev(n) \u2014 rev(n) === row(n).reverse()`);
    for (let n = 0; n <= Math.min(size, 4); n++) {
      check(
        `rev(${n}) === [...row(${n})].reverse()`,
        T.rev(n),
        [...T.row(n)].reverse()
      );
    }
    section(`[${T.id}]  alt(n) \u2014 alt(n)[k] === (-1)^k * row(n)[k]`);
    for (let n = 0; n <= Math.min(size, 4); n++) {
      check(
        `alt(${n}) has alternating signs`,
        T.alt(n),
        T.row(n).map((v, k) => k % 2 === 0 ? v : -v)
      );
    }
    section(`[${T.id}]  acc(n) \u2014 last element equals sum(n)`);
    for (let n = 0; n <= Math.min(size, 4); n++) {
      const a = T.acc(n);
      check(`acc(${n}).at(-1) === sum(${n})`, a[a.length - 1], T.sum(n));
    }
    section(`[${T.id}]  diff(n) \u2014 round-trip: acc(diff(n)) === row(n)`);
    for (let n = 1; n <= Math.min(size, 4); n++) {
      let s = 0n;
      const roundTrip = T.diff(n).map((v) => (s += v, s));
      check(`acc(diff(${n})) === row(${n})`, roundTrip, T.row(n));
    }
    section(`[${T.id}]  der(n) \u2014 der(n)[j] === row(n)[j+1] * (j+1)`);
    for (let n = 1; n <= Math.min(size, 4); n++) {
      const expected = Array.from(
        { length: n },
        (_, j) => T.row(n)[j + 1] * BigInt(j + 1)
      );
      check(`der(${n}) === [row(${n})[j+1]*(j+1)]`, T.der(n), expected);
    }
    section(`[${T.id}]  sum(n) \u2014 equals row(n).reduce(+)`);
    for (let n = 0; n <= Math.min(size, 5); n++) {
      const expected = T.row(n).reduce((a, b) => a + b, 0n);
      check(`sum(${n}) === reduce(row(${n}))`, T.sum(n), expected);
    }
    section(`[${T.id}]  flat(${size}) \u2014 length and spot checks`);
    const flat = T.flat(size);
    const expectedLen = size * (size + 1) / 2;
    check(`flat(${size}).length === ${expectedLen}`, flat.length, expectedLen);
    check(`flat(${size})[0] === val(0, 0)`, flat[0], T.val(0, 0));
    const lastRow = T.row(size - 1);
    check(
      `flat(${size}).at(-1) === row(${size - 1}).at(-1)`,
      flat[flat.length - 1],
      lastRow[lastRow.length - 1]
    );
    section(`[${T.id}]  diag(n, ${size}) \u2014 diag(n, size)[i] === val(n+i, i)`);
    for (let n = 0; n <= 2; n++) {
      console.log(`  diag(${n}, ${size}) = [${T.diag(n, size).join(", ")}]`);
    }
    for (let n = 0; n <= 2; n++) {
      check(
        `diag(${n}, ${size})[i] === val(${n}+i, i)`,
        T.diag(n, size),
        Array.from({ length: size }, (_, i) => T.val(n + i, i))
      );
    }
    section(`[${T.id}]  col(k, ${size}) \u2014 col(k, size)[i] === val(k+i, k)`);
    for (let k = 0; k <= 2; k++) {
      console.log(`  col(${k}, ${size}) = [${T.col(k, size).join(", ")}]`);
    }
    for (let k = 0; k <= 2; k++) {
      check(
        `col(${k}, ${size})[i] === val(${k}+i, ${k})`,
        T.col(k, size),
        Array.from({ length: size }, (_, i) => T.val(k + i, k))
      );
    }
    section(`[${T.id}]  antidiag(n) \u2014 antidiag(n)[k] === T(n-k, k)`);
    for (let n = 0; n <= Math.min(size, 4); n++) {
      console.log(`  antidiag(${n}) = [${T.antidiag(n).join(", ")}]`);
    }
    for (let n = 0; n <= Math.min(size, 4); n++) {
      const len = Math.floor((n + 2) / 2);
      check(
        `antidiag(${n})[k] === T(${n}-k, k)`,
        T.antidiag(n),
        Array.from({ length: len }, (_, k) => T.row(n - k)[k])
      );
    }
    section(`[${T.id}]  poly(n, x) \u2014 poly(n, 1n) === sum(n)`);
    for (let n = 0; n <= Math.min(size, 4); n++) {
      check(`poly(${n}, 1n) === sum(${n})`, T.poly(n, 1n), T.sum(n));
    }
    section(`[${T.id}]  trans(s, ${size}) \u2014 transform of s(n) = n`);
    const trans = T.trans((n) => BigInt(n), size);
    console.log("  [" + trans.join(", ") + "]");
    section(`[${T.id}]  invtrans(s, ${size}) \u2014 inverse transform of s(n) = n\xB2`);
    const invtrans = T.invtrans((n) => BigInt(n * n), size);
    console.log("  [" + invtrans.join(", ") + "]");
    section(`[${T.id}]  off(0, 0)(n) \u2014 equals row(n)`);
    const off00 = T.off(0, 0);
    for (let n = 0; n < Math.min(size, 4); n++) {
      check(`off(0, 0)(${n}) === row(${n})`, off00(n), T.row(n));
    }
    if (T.invQ) {
      section(`[${T.id}]  inv(${size}) \u2014 inverse triangle  (${T.invid})`);
      const inv = T.inv(size);
      for (const row of inv) console.log("  [" + row.join(", ") + "]");
    } else {
      section(`[${T.id}]  inv \u2014 skipped (invQ = false, no registered inverse)`);
    }
    if (T.invQ) {
      section(`[${T.id}]  revinv(${size})`);
      const ri = T.revinv(size);
      for (const row of ri) console.log("  [" + row.join(", ") + "]");
    }
    section(`[${T.id}]  Metadata`);
    console.log(`  id:    ${T.id}`);
    console.log(`  oeis:  ${T.oeis.join(", ")}`);
    console.log(`  invid: ${T.invid}`);
    console.log(`  invQ:  ${T.invQ}`);
    console.log(`  tex:   ${T.tex}`);
    section(`[${T.id}]  Benchmark`);
    Bench(T.gen, T.id);
    console.log(`
[${T.id}]  Done.
`);
  }
  var bigintReplacer;
  var init_Tests = __esm({
    "Tests.ts"() {
      "use strict";
      init_tablutils();
      init_Abel();
      init_Bell();
      init_Bessel();
      init_BesselInv();
      init_BinaryPell();
      init_Binomial();
      init_BinomialCatalan();
      init_BinomialInv();
      init_Catalan();
      init_CatalanInv();
      init_CatalanPaths();
      init_Chains();
      init_ChebyshevS();
      init_ChebyshevT();
      init_ChebyshevU();
      init_CompositionLP();
      init_Delannoy();
      init_DelannoyInv();
      init_Divisibility();
      init_DyckPaths();
      init_DyckPathsInv();
      init_Entringer();
      init_Euler();
      init_Eulerian();
      init_EulerSec();
      init_EulerTan();
      init_FallingFactorial();
      init_Fibonacci();
      init_Fubini();
      init_Gaussq2();
      init_Genocchi();
      init_Laguerre();
      init_Lah();
      init_Lehmer();
      init_Leibniz();
      init_Lucas();
      init_Moebius();
      init_Monotone();
      init_Motzkin();
      init_Narayana();
      init_Nicomachus();
      init_Parades();
      init_Partition();
      init_Powers();
      init_PowLaguerre();
      init_Rencontres();
      init_RisingFactorial();
      init_Schroeder();
      init_Sierpinski();
      init_StirlingCycle();
      init_StirlingSet();
      init_TernaryTrees();
      init_UpDownWords();
      init_Worpitzky();
      bigintReplacer = (_, v) => typeof v === "bigint" ? v.toString() : v;
      if (__tableExplorerRequire.main === __tableExplorerModule) {
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
    }
  });

  // Bell.ts
  function bell(n) {
    if (n === 0) return [1n];
    const cached = bellCache.get(n);
    if (cached !== void 0) return cached;
    const prev = bell(n - 1);
    const row = [prev[n - 1], ...prev];
    for (let k = 1; k <= n; k++) {
      row[k] += row[k - 1];
    }
    bellCache.set(n, row);
    return row;
  }
  var bellCache, Bell;
  var init_Bell = __esm({
    "Bell.ts"() {
      "use strict";
      init_tabltypes();
      bellCache = /* @__PURE__ */ new Map();
      Bell = new Table(
        bell,
        "Bell",
        ["A011971", "A011972", "A123346"],
        "A000000",
        String.raw`\sum_{j=0}^{k} \binom{k}{j} Bell(n - k + j)`
      );
      if (__tableExplorerRequire.main === __tableExplorerModule) {
        Promise.resolve().then(() => (init_Tests(), Tests_exports)).then(({ TestTable: TestTable2 }) => TestTable2(Bell));
      }
    }
  });

  // tabloeis.ts
  function formatAnum(number) {
    return "A" + String(number).padStart(6, "0");
  }
  function seqToString(seq, maxLen, maxTerms, offset, absVal) {
    const slice = seq.slice(offset, offset + maxTerms);
    let result = "";
    for (const v of slice) {
      const term = String(absVal ? v < 0n ? -v : v : v);
      const next = result ? result + "," + term : term;
      if (next.length > maxLen) break;
      result = next;
    }
    return result;
  }
  function countCommas(s, from = 0, to = s.length) {
    let count = 0;
    for (let i = from; i < to; i++) {
      if (s[i] === ",") count++;
    }
    return count;
  }
  function lcsubstr(s, t) {
    let swapped = false;
    if (s.length < t.length) {
      [s, t] = [t, s];
      swapped = true;
    }
    const lt = t.length;
    let prev = new Array(lt + 1).fill(0);
    let longest = 0;
    let xLongest = 0;
    for (let i = 1; i <= s.length; i++) {
      const curr = new Array(lt + 1).fill(0);
      for (let j = 1; j <= lt; j++) {
        if (s[i - 1] === t[j - 1]) {
          curr[j] = prev[j - 1] + 1;
          if (curr[j] > longest) {
            longest = curr[j];
            xLongest = i;
          }
        }
      }
      prev = curr;
    }
    let start = xLongest - longest;
    if (swapped) {
      const common = s.slice(start, start + longest);
      start = common ? t.indexOf(common) : 0;
    }
    return [start, longest];
  }
  async function QueryOEIS(seqlist, maxnum = 1, info = false, minlen = 24) {
    if (seqlist.length < minlen) {
      console.log(`Sequence is too short! We require at least ${minlen} terms.`);
      console.log("You provided:", seqlist);
      return 0;
    }
    const sum36 = seqlist.slice(0, 36).reduce((a, b) => a + b, 0n);
    if (sum36 === 0n) return 4;
    const rest = seqlist.slice(3, 36).reduce((a, b) => a + b, 0n);
    const off = rest === 0n ? 0 : 3;
    let seqstr = seqToString(seqlist, 160, 36, off, true);
    let url = `https://oeis.org/search?q=${seqstr}&fmt=json`;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const backoffs = [0, 1e3, 2e3, 4e3];
    for (let attempt = 0; attempt < 4; attempt++) {
      if (backoffs[attempt] > 0) await delay(backoffs[attempt]);
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(7e4) });
        if (!response.ok && response.status !== 200) {
          throw new Error(`HTTP ${response.status}`);
        }
        const jdata = await response.json();
        if (!jdata) {
          const evenZero = seqlist.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0n) === 0n;
          const oddZero = seqlist.filter((_, i) => i % 2 === 1).reduce((a, b) => a + b, 0n) === 0n;
          if (evenZero || oddZero) {
            const stripped = seqlist.filter((v) => v !== 0n);
            seqstr = seqToString(stripped, 160, 36, 3, true);
            if (info) console.log("Searching without zeros:", seqstr);
            url = `https://oeis.org/search?q=${seqstr}&fmt=json`;
            continue;
          }
          if (info) console.log("Sorry, no match found for:", seqstr);
          return 0;
        }
        let number = 0;
        let dl = 0;
        let ol = 0;
        for (let j = 0; j < Math.min(maxnum, jdata.length); j++) {
          const seq = jdata[j];
          number = seq.number;
          const anumber = formatAnum(number);
          const name = seq.name;
          const data = seq.data.replace(/-/g, "");
          const queryStr = seqToString(seqlist, 160, 25, 0, true);
          const [start, length] = lcsubstr(data, queryStr);
          ol = countCommas(data);
          dl = countCommas(data, start, start + length);
          if (dl < 12) {
            console.log(`
*** WARNING! Only ${dl} out of ${ol} terms match! ***
`);
          }
          if (info || dl < 12) {
            console.log("You searched:", queryStr);
            console.log("OEIS-data is:", data);
            console.log("*** Found:", anumber, name);
          }
          if (dl > 12) break;
        }
        return number;
      } catch (_err) {
        if (attempt < 3) continue;
        console.log(`Exception! Could not open ${url}.`);
        return -999999;
      }
    }
    console.log(`Exception! Could not open ${url}.`);
    return -999999;
  }
  function Generate(t, trait, info = true) {
    return trait(t, 24);
  }
  async function LookUp(seq, info = true) {
    return QueryOEIS(seq, 1, info);
  }
  if (__tableExplorerRequire.main === __tableExplorerModule) {
    const { Binomial: Binomial2 } = __tableExplorerRequire("./Binomial");
    const { TablSum: TablSum2 } = __tableExplorerRequire("./tabltraits");
    const data3 = [
      36n,
      32n,
      5n,
      25n,
      100n,
      200n,
      125n,
      14n,
      36n,
      225n,
      800n,
      1125n,
      504n,
      42n,
      49n,
      441n,
      2450n,
      6125n,
      6174n,
      2058n,
      132n,
      64n,
      784n,
      6272n
    ];
    (async () => {
      console.log(await QueryOEIS(data3, 1, true));
      const seq = Generate(Binomial2, TablSum2);
      const anum = await LookUp(seq);
      console.log("A-number:", anum);
    })();
  }

  // tabltraits.ts
  init_tabltypes();
  init_Binomial();
  init_BinomialInv();
  function gcd(a, b) {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b !== 0n) {
      [a, b] = [b, a % b];
    }
    return a;
  }
  function lcm(a, b) {
    if (a === 0n || b === 0n) return 0n;
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    return a / gcd(a, b) * b;
  }
  function prefixSumTotal(row) {
    let acc = 0n, total = 0n;
    for (const v of row) {
      acc += v;
      total += acc;
    }
    return total;
  }
  function dotproduct(vec, tor) {
    return vec.reduce((s, v, i) => s + v * tor[i], 0n);
  }
  function SeqToString(seq, maxLine, maxTerms) {
    const str = seq.slice(0, maxTerms).join(", ");
    return str.length <= maxLine ? str : str.slice(0, maxLine) + "...";
  }
  function Triangle(T, size = 7) {
    return T.flat(size);
  }
  function Trev(T, size = 7) {
    return Array.from({ length: size }, (_, n) => T.rev(n)).flat();
  }
  function Tinv(T, size = 7) {
    return T.inv(size).flat();
  }
  function Tinvrev(T, size = 7) {
    return T.invrev(size).flat();
  }
  function Trevinv(T, size = 7) {
    return T.revinv(size).flat();
  }
  function Toff11(T, size = 8) {
    const T11 = new Table(T.off(1, 1), T.id + "off11");
    return T11.flat(size);
  }
  function Trev11(T, size = 8) {
    return Array.from({ length: size }, (_, n) => T.rev11(n)).flat();
  }
  function Tinv11(T, size = 8) {
    return T.inv11(size).flat();
  }
  function Tinvrev11(T, size = 8) {
    return T.invrev11(size).flat();
  }
  function Trevinv11(T, size = 8) {
    return T.revinv11(size).flat();
  }
  function Talt(T, size = 7) {
    return Array.from({ length: size }, (_, n) => T.alt(n)).flat();
  }
  function Tacc(T, size = 7) {
    return Array.from({ length: size }, (_, n) => T.acc(n)).flat();
  }
  function Tder(T, size = 8) {
    return Array.from({ length: size }, (_, n) => T.der(n)).flat();
  }
  function Tantidiag(T, size = 9) {
    return Array.from({ length: size }, (_, n) => T.antidiag(n)).flat();
  }
  function TablCol0(T, size = 28, rev = false) {
    return rev ? TablDiag0(T, size) : Array.from({ length: size }, (_, n) => T.val(n, 0));
  }
  function TablCol1(T, size = 28, rev = false) {
    return rev ? TablDiag1(T, size) : Array.from({ length: size }, (_, n) => T.val(1 + n, 1));
  }
  function TablCol2(T, size = 28, rev = false) {
    return rev ? TablDiag2(T, size) : Array.from({ length: size }, (_, n) => T.val(2 + n, 2));
  }
  function TablCol3(T, size = 28, rev = false) {
    return rev ? TablDiag3(T, size) : Array.from({ length: size }, (_, n) => T.val(3 + n, 3));
  }
  function TablDiag0(T, size = 28, rev = false) {
    return rev ? TablCol0(T, size) : Array.from({ length: size }, (_, k) => T.val(k, k));
  }
  function TablDiag1(T, size = 28, rev = false) {
    return rev ? TablCol1(T, size) : Array.from({ length: size }, (_, k) => T.val(1 + k, k));
  }
  function TablDiag2(T, size = 28, rev = false) {
    return rev ? TablCol2(T, size) : Array.from({ length: size }, (_, k) => T.val(2 + k, k));
  }
  function TablDiag3(T, size = 28, rev = false) {
    return rev ? TablCol3(T, size) : Array.from({ length: size }, (_, k) => T.val(3 + k, k));
  }
  function PolyRow1(T, size = 28) {
    return Array.from({ length: size }, (_, v) => T.poly(1, BigInt(v)));
  }
  function PolyRow2(T, size = 28) {
    return Array.from({ length: size }, (_, v) => T.poly(2, BigInt(v)));
  }
  function PolyRow3(T, size = 28) {
    return Array.from({ length: size }, (_, v) => T.poly(3, BigInt(v)));
  }
  function PolyCol2(T, size = 28) {
    return Array.from({ length: size }, (_, v) => T.poly(v, 2n));
  }
  function PolyCol3(T, size = 28) {
    return Array.from({ length: size }, (_, v) => T.poly(v, 3n));
  }
  function PolyDiag(T, size = 28) {
    return Array.from({ length: size }, (_, n) => T.poly(n, BigInt(n)));
  }
  function RowLcmGcd(g, row, lg) {
    const Z = g(row).filter((v) => v !== -1n && v !== 0n && v !== 1n);
    if (Z.length === 0) return 1n;
    return lg ? Z.reduce((a, b) => lcm(a, b), 1n) : Z.reduce((a, b) => gcd(a, b));
  }
  function TablLcm(T, size = 28) {
    return Array.from({ length: size }, (_, n) => RowLcmGcd((r) => T.row(r), n, true));
  }
  function TablGcd(T, size = 28) {
    return Array.from({ length: size }, (_, n) => RowLcmGcd((r) => T.row(r), n, false));
  }
  function TablMax(T, size = 28) {
    return Array.from(
      { length: size },
      (_, n) => T.row(n).reduce((a, t) => {
        const av = t < 0n ? -t : t;
        return av > a ? av : a;
      }, 0n)
    );
  }
  function TablSum(T, size = 28) {
    return Array.from({ length: size }, (_, n) => T.sum(n));
  }
  function EvenSum(T, size = 28) {
    return Array.from(
      { length: size },
      (_, n) => T.row(n).filter((_2, i) => i % 2 === 0).reduce((a, b) => a + b, 0n)
    );
  }
  function OddSum(T, size = 28) {
    return Array.from(
      { length: size },
      (_, n) => T.row(n).filter((_2, i) => i % 2 === 1).reduce((a, b) => a + b, 0n)
    );
  }
  function AltSum(T, size = 28) {
    return Array.from({ length: size }, (_, n) => {
      const row = T.row(n);
      const even = row.filter((_2, i) => i % 2 === 0).reduce((a, b) => a + b, 0n);
      const odd = row.filter((_2, i) => i % 2 === 1).reduce((a, b) => a + b, 0n);
      return even - odd;
    });
  }
  function AbsSum(T, size = 28) {
    return Array.from(
      { length: size },
      (_, n) => T.row(n).reduce((a, t) => a + (t < 0n ? -t : t), 0n)
    );
  }
  function AccSum(T, size = 28) {
    return Array.from(
      { length: size },
      (_, n) => T.acc(n).reduce((a, b) => a + b, 0n)
    );
  }
  function AccRevSum(T, size = 28) {
    return Array.from({ length: size }, (_, n) => prefixSumTotal(T.rev(n)));
  }
  function AntiDSum(T, size = 28) {
    return Array.from(
      { length: size },
      (_, n) => T.antidiag(n).reduce((a, b) => a + b, 0n)
    );
  }
  function ColMiddle(T, size = 28) {
    return Array.from({ length: size }, (_, n) => T.val(n, Math.floor(n / 2)));
  }
  function CentralE(T, size = 28) {
    return Array.from({ length: size }, (_, n) => T.val(2 * n, n));
  }
  function CentralO(T, size = 28) {
    return Array.from({ length: size }, (_, n) => T.val(2 * n + 1, n));
  }
  function PolyFrac(row, v) {
    let result = 0n;
    for (const c of row) {
      result = result * v + c;
    }
    return result;
  }
  function PosHalf(T, size = 28) {
    return Array.from({ length: size }, (_, n) => PolyFrac(T.row(n), 2n));
  }
  function NegHalf(T, size = 28) {
    return Array.from({ length: size }, (_, n) => PolyFrac(T.row(n), -2n));
  }
  function TransNat0(T, size = 28) {
    return T.trans((k) => BigInt(k), size);
  }
  function TransNat1(T, size = 28) {
    return T.trans((k) => BigInt(k + 1), size);
  }
  function TransSqrs(T, size = 28) {
    return T.trans((k) => BigInt(k * k), size);
  }
  function BinConv(T, size = 28) {
    return Array.from({ length: size }, (_, n) => dotproduct(binomial(n), T.row(n)));
  }
  function InvBinConv(T, size = 28) {
    return Array.from({ length: size }, (_, n) => dotproduct(binomialinv(n), T.row(n)));
  }
  function RevToff11(t, size = 8) {
    const T = RevTable(t);
    const T11 = new Table(T.off(1, 1), T.id + "off11");
    return T11.flat(size);
  }
  function RevTrev11(t, size = 8) {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => T.rev11(n)).flat();
  }
  function RevTinv11(t, size = 8) {
    const T = RevTable(t);
    return T.inv11(size).flat();
  }
  function RevTalt(t, size = 7) {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => T.alt(n)).flat();
  }
  function RevTacc(t, size = 7) {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => T.acc(n)).flat();
  }
  function RevTder(t, size = 8) {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => T.der(n)).flat();
  }
  function RevTantidiag(t, size = 9) {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => T.antidiag(n)).flat();
  }
  function RevPolyRow1(t, size = 28) {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, v) => T.poly(1, BigInt(v)));
  }
  function RevPolyRow2(t, size = 28) {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, v) => T.poly(2, BigInt(v)));
  }
  function RevPolyRow3(t, size = 28) {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, v) => T.poly(3, BigInt(v)));
  }
  function RevPolyCol3(t, size = 28) {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, v) => T.poly(v, 3n));
  }
  function RevPolyDiag(t, size = 28) {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => T.poly(n, BigInt(n)));
  }
  function RevEvenSum(t, size = 28) {
    const T = RevTable(t);
    return Array.from(
      { length: size },
      (_, n) => T.row(n).filter((_2, i) => i % 2 === 0).reduce((a, b) => a + b, 0n)
    );
  }
  function RevOddSum(t, size = 28) {
    const T = RevTable(t);
    return Array.from(
      { length: size },
      (_, n) => T.row(n).filter((_2, i) => i % 2 === 1).reduce((a, b) => a + b, 0n)
    );
  }
  function RevAccRevSum(t, size = 28) {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => prefixSumTotal(T.rev(n)));
  }
  function RevAntiDSum(t, size = 28) {
    const T = RevTable(t);
    return Array.from(
      { length: size },
      (_, n) => T.antidiag(n).reduce((a, b) => a + b, 0n)
    );
  }
  function RevColMiddle(t, size = 28) {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => T.val(n, Math.floor(n / 2)));
  }
  function RevCentralO(t, size = 28) {
    const T = RevTable(t);
    return Array.from({ length: size }, (_, n) => T.val(2 * n + 1, n));
  }
  function RevPosHalf(t, size = 28) {
    return Array.from({ length: size }, (_, n) => PolyFrac(t.rev(n), 2n));
  }
  function RevNegHalf(t, size = 28) {
    return Array.from({ length: size }, (_, n) => PolyFrac(t.rev(n), -2n));
  }
  function RevTransNat0(t, size = 28) {
    const T = RevTable(t);
    return T.trans((k) => BigInt(k), size);
  }
  function RevTransNat1(t, size = 28) {
    const T = RevTable(t);
    return T.trans((k) => BigInt(k + 1), size);
  }
  function RevTransSqrs(t, size = 28) {
    const T = RevTable(t);
    return T.trans((k) => BigInt(k * k), size);
  }
  var TraitsDict = {
    "Triangle": [Triangle, 7, String.raw`\(T_{n,k}\)`],
    "Tinv": [Tinv, 7, String.raw`\(T^{-1}_{n,k}\)`],
    "Trev": [Trev, 7, String.raw`\(T_{n,n-k}\)`],
    "Tinvrev": [Tinvrev, 7, String.raw`\((T_{n,n-k})^{-1}\)`],
    "Trevinv": [Trevinv, 7, String.raw`\((T^{-1})_{n,n-k}\)`],
    "Toff11": [Toff11, 7, String.raw`\(T_{n+1,k+1} \)`],
    "Trev11": [Trev11, 7, String.raw`\(T_{n+1,n-k+1} \)`],
    "Tinv11": [Tinv11, 7, String.raw`\(T^{-1}_{n+1,k+1}\)`],
    "Tinvrev11": [Tinvrev11, 7, String.raw`\((T_{n+1,n-k+1})^{-1}\)`],
    "Trevinv11": [Trevinv11, 7, String.raw`\((T^{-1}_{n+1,n-k+1})\)`],
    "Tantidiag": [Tantidiag, 9, String.raw`\(T_{n-k,k}\ \ (k \le n/2)\)`],
    "Tacc": [Tacc, 7, String.raw`\(\sum_{j=0}^{k} T_{n,j}\)`],
    "Talt": [Talt, 7, String.raw`\(T_{n,k}\ (-1)^{k}\)`],
    "Tder": [Tder, 8, String.raw`\(T_{n,k+1}\ (k+1) \)`],
    "TablCol0": [TablCol0, 28, String.raw`\(T_{n  ,0}\)`],
    "TablCol1": [TablCol1, 28, String.raw`\(T_{n+1,1}\)`],
    "TablCol2": [TablCol2, 28, String.raw`\(T_{n+2,2}\)`],
    "TablCol3": [TablCol3, 28, String.raw`\(T_{n+3,3}\)`],
    "TablDiag0": [TablDiag0, 28, String.raw`\(T_{n  ,n}\)`],
    "TablDiag1": [TablDiag1, 28, String.raw`\(T_{n+1,n}\)`],
    "TablDiag2": [TablDiag2, 28, String.raw`\(T_{n+2,n}\)`],
    "TablDiag3": [TablDiag3, 28, String.raw`\(T_{n+3,n}\)`],
    "TablLcm": [TablLcm, 28, String.raw`\(\text{lcm} \{ \ \| T_{n,k} \| : k=0..n \} \)`],
    "TablGcd": [TablGcd, 28, String.raw`\(\text{gcd} \{ \ \| T_{n,k} \| : k=0..n \} \)`],
    "TablMax": [TablMax, 28, String.raw`\(\text{max} \{ \ \| T_{n,k} \| : k=0..n \} \)`],
    "TablSum": [TablSum, 28, String.raw`\(\sum_{k=0}^{n} T_{n,k}\)`],
    "EvenSum": [EvenSum, 28, String.raw`\(\sum_{k=0}^{n} T_{n,k}\ ( 2 \mid k) \)`],
    "OddSum": [OddSum, 28, String.raw`\(\sum_{k=0}^{n} T_{n,k}\ (1 - (2 \mid k)) \)`],
    "AltSum": [AltSum, 28, String.raw`\(\sum_{k=0}^{n} T_{n,k}\ (-1)^{k}\)`],
    "AbsSum": [AbsSum, 28, String.raw`\(\sum_{k=0}^{n} \| T_{n,k} \| \)`],
    "AccSum": [AccSum, 28, String.raw`\(\sum_{k=0}^{n} \sum_{j=0}^{k} T_{n,j}\)`],
    "AccRevSum": [AccRevSum, 28, String.raw`\(\sum_{k=0}^{n} \sum_{j=0}^{k} T_{n,n-j}\)`],
    "AntiDSum": [AntiDSum, 28, String.raw`\(\sum_{k=0}^{n/2} T_{n-k, k}\)`],
    "ColMiddle": [ColMiddle, 28, String.raw`\(T_{n, n / 2}\)`],
    "CentralE": [CentralE, 28, String.raw`\(T_{2 n, n}\)`],
    "CentralO": [CentralO, 28, String.raw`\(T_{2 n + 1, n}\)`],
    "PosHalf": [PosHalf, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ 2^{n-k} \)`],
    "NegHalf": [NegHalf, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ (-2)^{n-k} \)`],
    "TransNat0": [TransNat0, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ k\)`],
    "TransNat1": [TransNat1, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ (k+1)\)`],
    "TransSqrs": [TransSqrs, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ k^{2}\)`],
    "BinConv": [BinConv, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ \binom{n}{k} \)`],
    "InvBinConv": [InvBinConv, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ (-1)^{n-k}\ \binom{n}{k}\)`],
    "PolyRow1": [PolyRow1, 28, String.raw`\(\sum_{k=0}^{1}T_{1,k}\ n^k\)`],
    "PolyRow2": [PolyRow2, 28, String.raw`\(\sum_{k=0}^{2}T_{2,k}\ n^k\)`],
    "PolyRow3": [PolyRow3, 28, String.raw`\(\sum_{k=0}^{3}T_{3,k}\ n^k\)`],
    "PolyCol2": [PolyCol2, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ 2^k\)`],
    "PolyCol3": [PolyCol3, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ 3^k\)`],
    "PolyDiag": [PolyDiag, 28, String.raw`\(\sum_{k=0}^{n}T_{n,k}\ n^k\)`],
    "RevToff11": [RevToff11, 7, String.raw`\(T_{n+1,n-k} \)`],
    "RevTrev11": [RevTrev11, 7, String.raw`\(T_{n+1,k} \)`],
    "RevTinv11": [RevTinv11, 7, String.raw`\(T^{-1}_{n+1,n-k}\)`],
    "RevTantidiag": [RevTantidiag, 9, String.raw`\(T_{n-k,n-2k}\ \ (k \le n/2)\)`],
    "RevTacc": [RevTacc, 7, String.raw`\(\sum_{j=0}^{n-k}T_{n,n-j}\)`],
    "RevTalt": [RevTalt, 7, String.raw`\(T_{n,n-k}\ (-1)^{n-k}\)`],
    "RevTder": [RevTder, 8, String.raw`\(T_{n+1,n-k}\ (n-k+1) \)`],
    "RevEvenSum": [RevEvenSum, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ (2 \mid k) \)`],
    "RevOddSum": [RevOddSum, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ (1- (2 \mid k)) \)`],
    "RevAccRevSum": [RevAccRevSum, 28, String.raw`\(\sum_{k=0}^{n} \sum_{j=0}^{k}T_{n,n-j}\)`],
    "RevAntiDSum": [RevAntiDSum, 28, String.raw`\(\sum_{k=0}^{n/2}T_{n-k,n-k}\)`],
    "RevColMiddle": [RevColMiddle, 28, String.raw`\(T_{n, n/2}\)`],
    "RevCentralO": [RevCentralO, 28, String.raw`\(T_{2n+1,n}\)`],
    "RevPosHalf": [RevPosHalf, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ 2^{n-k} \)`],
    "RevNegHalf": [RevNegHalf, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ (-2)^{n-k} \)`],
    "RevTransNat0": [RevTransNat0, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ k\)`],
    "RevTransNat1": [RevTransNat1, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ (k + 1)\)`],
    "RevTransSqrs": [RevTransSqrs, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ k^{2}\)`],
    "RevPolyRow1": [RevPolyRow1, 28, String.raw`\(\sum_{k=0}^{1}T_{1,n-k}\ n^k\)`],
    "RevPolyRow2": [RevPolyRow2, 28, String.raw`\(\sum_{k=0}^{2}T_{2,n-k}\ n^k\)`],
    "RevPolyRow3": [RevPolyRow3, 28, String.raw`\(\sum_{k=0}^{3}T_{3,n-k}\ n^k\)`],
    "RevPolyCol3": [RevPolyCol3, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ 3^k\)`],
    "RevPolyDiag": [RevPolyDiag, 28, String.raw`\(\sum_{k=0}^{n}T_{n,n-k}\ n^k\)`]
  };
  function TableTraits(T) {
    for (const [traitId, tr] of Object.entries(TraitsDict)) {
      const name = T.id + "_" + traitId;
      const tex = tr[2];
      const seq = tr[0](T, tr[1]);
      console.log(name, tex);
      console.log(SeqToString(seq, 60, 20));
    }
  }
  if (__tableExplorerRequire.main === __tableExplorerModule) {
    Promise.resolve().then(() => (init_Abel(), Abel_exports)).then(({ Abel: Abel2 }) => {
      TableTraits(Abel2);
    });
  }

  // browser-api.ts
  init_Abel();
  init_Bell();
  init_Bessel();
  init_BesselInv();
  init_BinaryPell();
  init_Binomial();
  init_BinomialCatalan();
  init_BinomialInv();
  init_Catalan();
  init_CatalanInv();
  init_CatalanPaths();
  init_Chains();
  init_ChebyshevS();
  init_ChebyshevT();
  init_ChebyshevU();
  init_CompositionLP();
  init_Delannoy();
  init_DelannoyInv();
  init_Divisibility();
  init_DyckPaths();
  init_DyckPathsInv();
  init_Entringer();
  init_Euler();
  init_Eulerian();
  init_EulerSec();
  init_EulerTan();
  init_FallingFactorial();
  init_Fibonacci();
  init_Fubini();
  init_Gaussq2();
  init_Genocchi();
  init_Laguerre();
  init_Lah();
  init_Lehmer();
  init_Leibniz();
  init_Lucas();
  init_Moebius();
  init_Monotone();
  init_Motzkin();
  init_Narayana();
  init_Nicomachus();
  init_Parades();
  init_Partition();
  init_Powers();
  init_PowLaguerre();
  init_Rencontres();
  init_RisingFactorial();
  init_Schroeder();
  init_Sierpinski();
  init_StirlingCycle();
  init_StirlingSet();
  init_TernaryTrees();
  init_UpDownWords();
  init_Worpitzky();
  var TABLES = {
    Abel,
    Bell,
    Bessel,
    BesselInv,
    BinaryPell,
    Binomial,
    BinomialCatalan,
    BinomialInv,
    Catalan,
    CatalanInv,
    CatalanPaths,
    Chains,
    ChebyshevS,
    ChebyshevT,
    ChebyshevU,
    CompositionLP,
    Delannoy,
    DelannoyInv,
    Divisibility,
    DyckPaths,
    DyckPathsInv,
    Entringer,
    Euler,
    Eulerian,
    EulerSec,
    EulerTan,
    FallingFactorial,
    Fibonacci,
    Fubini,
    Gaussq2,
    Genocchi,
    Laguerre,
    Lah,
    Lehmer,
    Leibniz,
    Lucas,
    Moebius,
    Monotone,
    Motzkin,
    Narayana,
    Nicomachus,
    Parades,
    Partition,
    Powers,
    PowLaguerre,
    Rencontres,
    RisingFactorial,
    Schroeder,
    Sierpinski,
    StirlingCycle,
    StirlingSet,
    TernaryTrees,
    UpDownWords,
    Worpitzky
  };
  var TRAIT_MAP = {
    "Flat": "Triangle",
    "Reverse": "Trev",
    "Inverse": "Tinv",
    "RevInv": "Trevinv",
    "InvRev": "Tinvrev",
    "DiagTri": "Tantidiag",
    "PolyTri": "Tder",
    "Sum": "TablSum",
    "EvenSum": "EvenSum",
    "OddSum": "OddSum",
    "AltSum": "AltSum",
    "DiagSum": "AntiDSum",
    "Middle": "ColMiddle",
    "Central": "CentralE",
    "LeftSide": "TablCol0",
    "RightSide": "TablDiag0",
    "PosHalf": "PosHalf",
    "NegHalf": "NegHalf",
    "PolyVal2": "PolyCol2",
    "PolyVal3": "PolyCol3",
    "PolyValn": "PolyDiag",
    "BinConv": "BinConv",
    "IBinConv": "InvBinConv",
    "TransSqrs": "TransSqrs",
    "TransNat0": "TransNat0",
    "TransNat1": "TransNat1"
  };
  function getTable(table) {
    const t = TABLES[table.trim()];
    if (!t) throw new Error(`Unknown table: ${table}`);
    return t;
  }
  function listTables() {
    return Object.keys(TABLES).sort();
  }
  function lookup(table, trait) {
    const t = getTable(table);
    const traitKey = TRAIT_MAP[trait.trim()] ?? trait.trim();
    const entry = TraitsDict[traitKey];
    if (!entry) throw new Error(`Unknown trait: ${trait}`);
    const [fn, size, tex] = entry;
    const seq = fn(t, size);
    return { seq: seq.map(String), tex };
  }
  async function query(seq) {
    if (!Array.isArray(seq) || seq.length === 0) {
      throw new Error("seq must be a non-empty array of integers");
    }
    if (typeof window !== "undefined" && window.location.protocol.startsWith("http")) {
      try {
        const resp = await fetch("/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seq })
        });
        const payload = await resp.json();
        if (resp.ok && typeof payload.anum === "number") {
          return { anum: payload.anum };
        }
      } catch {
      }
    }
    if (typeof window !== "undefined" && window.location.protocol === "file:") {
      try {
        const resp = await fetch("http://localhost:3000/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seq })
        });
        const payload = await resp.json();
        if (resp.ok && typeof payload.anum === "number") {
          return { anum: payload.anum };
        }
      } catch {
      }
      return {
        anum: -999999,
        error: "Start local server for OEIS lookup (public/start-server.bat), then retry."
      };
    }
    const data = seq.map(BigInt);
    const anum = await QueryOEIS(data, 1, false);
    if (anum !== -999999) {
      return { anum };
    }
    return {
      anum: -999999,
      error: "OEIS lookup failed. If this persists, use http://localhost:3000/TableExplorer.html."
    };
  }
  function triangle(table) {
    const t = getTable(table);
    const size = 8;
    const tab = t.tab(size).map((r) => r.map(String));
    const array = Array.from({ length: size }, (_, n) => t.diag(n, size).map(String));
    return { tab, array, tex: t.tex ? `\\(${t.tex}\\)` : "" };
  }
  var api = {
    listTables,
    lookup,
    query,
    triangle
  };
  window.TableExplorerAPI = api;
})();
