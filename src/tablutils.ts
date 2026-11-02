/**
 * Benchmark utility: time triangle-generating row functions.
 * If the generator has a cacheSize property (duck-typed), the cache is
 * not cleared automatically — pass a fresh (uncached) function to get
 * cold timings, or reuse the same function across calls for warm timings.
 *
 * Usage:
 *   Bench(abel)            // uses function name, 8 size-steps
 *   Bench(abel, "abel", 5) // custom label, first 5 size-steps
 *
 * Iterates `for n in 0..X-1: f(n)` for each X in the step list and
 * reports wall-clock time in milliseconds.
 */

import { rowgen } from './tabltypes';

const STEPS = [5, 25, 100, 200, 300, 400, 600, 1000];

export function Bench(f: rowgen, name: string = "", len: number = 8): void {
    const label = (name || (f as { name?: string }).name || 'f').padEnd(12);
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
