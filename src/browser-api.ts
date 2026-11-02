import { QueryOEIS } from './tabloeis';
import { Table } from './tabltypes';
import { TraitsDict } from './tabltraits';

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

const TABLES: Record<string, Table> = {
    Abel, Bell, Bessel, BesselInv, BinaryPell, Binomial, BinomialCatalan, BinomialInv,
    Catalan, CatalanInv, CatalanPaths, Chains, ChebyshevS, ChebyshevT, ChebyshevU,
    CompositionLP, Delannoy, DelannoyInv, Divisibility, DyckPaths, DyckPathsInv,
    Entringer, Euler, Eulerian, EulerSec, EulerTan, FallingFactorial, Fibonacci, Fubini,
    Gaussq2, Genocchi, Laguerre, Lah, Lehmer, Leibniz, Lucas, Moebius, Monotone, Motzkin,
    Narayana, Nicomachus, Parades, Partition, Powers, PowLaguerre, Rencontres,
    RisingFactorial, Schroeder, Sierpinski, StirlingCycle, StirlingSet,
    TernaryTrees, UpDownWords, Worpitzky,
};

const TRAIT_MAP: Record<string, string> = {
    "Flat":      "Triangle",
    "Reverse":   "Trev",
    "Inverse":   "Tinv",
    "RevInv":    "Trevinv",
    "InvRev":    "Tinvrev",
    "DiagTri":   "Tantidiag",
    "PolyTri":   "Tder",
    "Sum":       "TablSum",
    "EvenSum":   "EvenSum",
    "OddSum":    "OddSum",
    "AltSum":    "AltSum",
    "DiagSum":   "AntiDSum",
    "Middle":    "ColMiddle",
    "Central":   "CentralE",
    "LeftSide":  "TablCol0",
    "RightSide": "TablDiag0",
    "PosHalf":   "PosHalf",
    "NegHalf":   "NegHalf",
    "PolyVal2":  "PolyCol2",
    "PolyVal3":  "PolyCol3",
    "PolyValn":  "PolyDiag",
    "BinConv":   "BinConv",
    "IBinConv":  "InvBinConv",
    "TransSqrs": "TransSqrs",
    "TransNat0": "TransNat0",
    "TransNat1": "TransNat1",
};

export interface TableExplorerAPI {
    listTables(): string[];
    lookup(table: string, trait: string): { seq: string[]; tex: string };
    query(seq: string[]): Promise<{ anum: number; error?: string }>;
    triangle(table: string): { tab: string[][]; array: string[][]; tex: string };
}

function getTable(table: string): Table {
    const t = TABLES[table.trim()];
    if (!t) throw new Error(`Unknown table: ${table}`);
    return t;
}

export function listTables(): string[] {
    return Object.keys(TABLES).sort();
}

export function lookup(table: string, trait: string): { seq: string[]; tex: string } {
    const t = getTable(table);
    const traitKey = TRAIT_MAP[trait.trim()] ?? trait.trim();
    const entry = TraitsDict[traitKey];
    if (!entry) throw new Error(`Unknown trait: ${trait}`);
    const [fn, size, tex] = entry;
    const seq = fn(t, size);
    return { seq: seq.map(String), tex };
}

export async function query(seq: string[]): Promise<{ anum: number; error?: string }> {
    if (!Array.isArray(seq) || seq.length === 0) {
        throw new Error('seq must be a non-empty array of integers');
    }

    if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
        try {
            const resp = await fetch('/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seq }),
            });
            const payload = await resp.json() as { anum?: number; error?: string };
            if (resp.ok && typeof payload.anum === 'number') {
                return { anum: payload.anum };
            }
        } catch {
            // Fall through to direct query fallback.
        }
    }

    if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
        try {
            const resp = await fetch('http://localhost:3000/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seq }),
            });
            const payload = await resp.json() as { anum?: number; error?: string };
            if (resp.ok && typeof payload.anum === 'number') {
                return { anum: payload.anum };
            }
        } catch {
            // Fall through to direct query fallback.
        }

        return {
            anum: -999999,
            error: 'Start local server for OEIS lookup (public/start-server.bat), then retry.',
        };
    }

    const data: bigint[] = seq.map(BigInt);
    const anum = await QueryOEIS(data, 1, false);
    if (anum !== -999999) {
        return { anum };
    }

    return {
        anum: -999999,
        error: 'OEIS lookup failed. If this persists, use http://localhost:3000/TableExplorer.html.',
    };
}

export function triangle(table: string): { tab: string[][]; array: string[][]; tex: string } {
    const t = getTable(table);
    const size = 8;
    const tab = t.tab(size).map(r => r.map(String));
    const array = Array.from({ length: size }, (_, n) => t.diag(n, size).map(String));
    return { tab, array, tex: t.tex ? `\\(${t.tex}\\)` : '' };
}

const api: TableExplorerAPI = {
    listTables,
    lookup,
    query,
    triangle,
};

declare global {
    interface Window {
        TableExplorerAPI: TableExplorerAPI;
    }
}

window.TableExplorerAPI = api;
