/**
 * Provides functionality to query the OEIS (Online Encyclopedia of Integer Sequences)
 * for a given sequence and determine if it is present in the database.
 *
 *   QueryOEIS(seqlist, maxnum?, info?, minlen?): Promise<number>
 *     Queries the OEIS for a given sequence to check if it is present.
 *       maxnum: Maximum number of sequences to be returned. Defaults to 1.
 *       info:   If true, prints details; otherwise quiet except for warnings. Defaults to false.
 *       minlen: Minimum length of the sequence required. Defaults to 24.
 *     Returns the A-number if found, 0 if not found, or -999999 if unreachable.
 *
 *   LookUp(t, tr, info?): Promise<number>
 *     Look up the A-number for a trait of a Table.
 *
 * The lcsubstr implementation is adapted from the Algorithm Implementation Wikibook
 * (CC BY-SA 4.0): https://en.wikibooks.org/wiki/Algorithm_Implementation/Strings/Longest_common_substring
 */

import { Table, Trait } from './tabltypes';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OEISResult {
    number: number;
    data:   string;
    name:   string;
    [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatAnum(number: number): string {
    return 'A' + String(number).padStart(6, '0');
}

/**
 * Build a comma-separated string from a bigint array for use in OEIS queries.
 * Skips the first `offset` elements, takes up to `maxTerms`, uses absolute
 * values when `absVal` is true, and truncates to at most `maxLen` characters
 * (at a comma boundary).
 */
function seqToString(
    seq: bigint[],
    maxLen: number,
    maxTerms: number,
    offset: number,
    absVal: boolean,
): string {
    const slice = seq.slice(offset, offset + maxTerms);
    let result = '';
    for (const v of slice) {
        const term = String(absVal ? (v < 0n ? -v : v) : v);
        const next = result ? result + ',' + term : term;
        if (next.length > maxLen) break;
        result = next;
    }
    return result;
}

/** Count occurrences of ',' in s[from..to). */
function countCommas(s: string, from: number = 0, to: number = s.length): number {
    let count = 0;
    for (let i = from; i < to; i++) {
        if (s[i] === ',') count++;
    }
    return count;
}

/**
 * Finds the longest contiguous common substring of s and t using
 * O(min(|s|, |t|)) working space.
 * Returns [startIndexInOriginalS, length].
 * Adapted from CC BY-SA 4.0 Algorithm Implementation Wikibook.
 */
function lcsubstr(s: string, t: string): [number, number] {
    let swapped = false;
    if (s.length < t.length) {
        [s, t] = [t, s];
        swapped = true;
    }

    const lt = t.length;
    let prev = new Array<number>(lt + 1).fill(0);
    let longest = 0;
    let xLongest = 0;

    for (let i = 1; i <= s.length; i++) {
        const curr = new Array<number>(lt + 1).fill(0);
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

// ---------------------------------------------------------------------------
// QueryOEIS
// ---------------------------------------------------------------------------

/**
 * Query if a given sequence is present in the OEIS. At least 24 terms
 * of the sequence must be given. The first three terms and signs are disregarded.
 * Sequences with very large terms may have too few terms for reliable results.
 * This is a heuristic function — understand its limited reach.
 *
 * Returns the A-number if found, 0 if not found, or -999999 if unreachable.
 */
export async function QueryOEIS(
    seqlist: bigint[],
    maxnum: number = 1,
    info:   boolean = false,
    minlen: number = 24,
): Promise<number> {
    if (seqlist.length < minlen) {
        console.log(`Sequence is too short! We require at least ${minlen} terms.`);
        console.log('You provided:', seqlist);
        return 0;
    }

    const sum36 = seqlist.slice(0, 36).reduce((a, b) => a + b, 0n);
    if (sum36 === 0n) return 4;  // don't search for the all-zeros sequence

    const rest = seqlist.slice(3, 36).reduce((a, b) => a + b, 0n);
    const off = rest === 0n ? 0 : 3;
    let seqstr = seqToString(seqlist, 160, 36, off, true);
    let url = `https://oeis.org/search?q=${seqstr}&fmt=json`;

    const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
    const backoffs = [0, 1000, 2000, 4000];

    for (let attempt = 0; attempt < 4; attempt++) {
        if (backoffs[attempt] > 0) await delay(backoffs[attempt]);
        try {
            const response = await fetch(url, { signal: AbortSignal.timeout(70_000) });
            if (!response.ok && response.status !== 200) {
                throw new Error(`HTTP ${response.status}`);
            }

            const jdata = await response.json() as OEISResult[] | null;

            if (!jdata) {
                // No results — try stripping zeros for alternating-zero sequences
                const evenZero = seqlist.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0n) === 0n;
                const oddZero  = seqlist.filter((_, i) => i % 2 === 1).reduce((a, b) => a + b, 0n) === 0n;
                if (evenZero || oddZero) {
                    const stripped = seqlist.filter(v => v !== 0n);
                    seqstr = seqToString(stripped, 160, 36, 3, true);
                    if (info) console.log('Searching without zeros:', seqstr);
                    url = `https://oeis.org/search?q=${seqstr}&fmt=json`;
                    continue;  // retry with stripped sequence
                }
                if (info) console.log('Sorry, no match found for:', seqstr);
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
                const data = seq.data.replace(/-/g, '');
                const queryStr = seqToString(seqlist, 160, 25, 0, true);
                const [start, length] = lcsubstr(data, queryStr);
                ol = countCommas(data);
                dl = countCommas(data, start, start + length);
                if (dl < 12) {
                    console.log(`\n*** WARNING! Only ${dl} out of ${ol} terms match! ***\n`);
                }
                if (info || dl < 12) {
                    console.log('You searched:', queryStr);
                    console.log('OEIS-data is:', data);
                    console.log('*** Found:', anumber, name);
                }
                if (dl > 12) break;
            }

            return number;

        } catch (err) {
            console.error(
                `OEIS attempt ${attempt + 1} failed:`,
                err
            );
            if (attempt < 3) continue;
            return -999999;
        }
    }

    console.log(`Exception! Could not open ${url}.`);
    return -999999;
}

// ---------------------------------------------------------------------------
// Generate and LookUp
// ---------------------------------------------------------------------------

/**
* Example:
* LookUp(Fubini, PolyDiag)
*/

export function Generate(t: Table, trait: Trait, info: boolean = true): bigint[] {
    return trait(t, 24);
}

/**
 * Look up the A-number in the OEIS database based on a trait of a table.
 *
 * Example:
 
 */
export async function LookUp(seq: bigint[], info: boolean = true): Promise<number> {
    return QueryOEIS(seq, 1, info);
}



// ---------------------------------------------------------------------------
// Main, run the command in the PowerShell PS prompt: npx ts-node tabloeis.ts
// ---------------------------------------------------------------------------

if (require.main === module) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Binomial } = require('./Binomial');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { TablSum } = require('./tabltraits');

    const data3: bigint[] = [
        36n, 32n, 5n, 25n, 100n, 200n, 125n, 14n, 36n, 225n,
        800n, 1125n, 504n, 42n, 49n, 441n, 2450n, 6125n, 6174n, 2058n,
        132n, 64n, 784n, 6272n,
    ];
    (async () => {
        console.log(await QueryOEIS(data3, 1, true));
        const seq = Generate(Binomial, TablSum);
        const anum = await LookUp(seq);
        console.log('A-number:', anum);  // expect A000079 ( 2^n)
    })();
}

