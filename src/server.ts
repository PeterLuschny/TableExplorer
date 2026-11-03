import express from 'express';
import path from 'path';
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

// Methods that take (n) -> trow
const ROW_METHODS = ['row', 'rev', 'alt', 'acc', 'diff', 'der', 'antidiag'] as const;
// Methods that take (n, size) -> trow
const ROW_SIZE_METHODS = ['diag', 'col'] as const;
// Methods that take (size) -> trow
const SIZE_METHODS = ['flat'] as const;

// Maps friendly GUI trait names → TraitsDict keys
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

const app = express();
app.use(express.json());
// On Vercel, files in /public are served by the CDN; express.static covers local runs.
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.get('/', (_req, res) => res.redirect('/TableExplorer.html'));

// Allow requests from file:// and any localhost origin
app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.options(/.*/, (_req, res) => res.sendStatus(204));

// List available tables
app.get('/tables', (_req, res) => {
    res.json({ tables: Object.keys(TABLES).sort() });
});

// Generate a sequence from a Table method
// Body: { table: string, method: string, args: number[] }
// Returns: { seq: string[] }  (bigints serialised as strings)
app.post('/generate', (req, res) => {
    try {
        const { table, method, args } = req.body as {
            table: string;
            method: string;
            args: number[];
        };

        const T = TABLES[table];
        if (!T) {
            res.status(400).json({ error: `Unknown table: ${table}` });
            return;
        }

        let result: bigint[];

        if ((ROW_METHODS as readonly string[]).includes(method)) {
            const [n] = args;
            result = (T as unknown as Record<string, (n: number) => bigint[]>)[method](n);
        } else if ((ROW_SIZE_METHODS as readonly string[]).includes(method)) {
            const [n, size] = args;
            result = (T as unknown as Record<string, (n: number, size: number) => bigint[]>)[method](n, size);
        } else if ((SIZE_METHODS as readonly string[]).includes(method)) {
            const [size] = args;
            result = (T as unknown as Record<string, (size: number) => bigint[]>)[method](size);
        } else {
            res.status(400).json({ error: `Unknown method: ${method}` });
            return;
        }

        res.json({ seq: result.map(String) });
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

app.post('/query', async (req, res) => {
    try {
        const input = req.body.seq;
        if (!Array.isArray(input) || input.length === 0) {
            res.status(400).json({ error: 'seq must be a non-empty array of integers' });
            return;
        }
        const seq: bigint[] = (input as string[]).map(BigInt);
        const anum = await QueryOEIS(seq, 1, false);
        res.json({ anum });
    } catch (err) {
        console.error('/query error:', err);
        res.status(500).json({ error: String(err) });
    }
});

// Look up a sequence by table name + trait name, then return the sequence values
// Body: { table: string, trait: string }
// Returns: { seq: string[] }
app.post('/lookup', (req, res) => {
    try {
        const { table, trait } = req.body as { table: string; trait: string };
        const T = TABLES[table.trim()];
        if (!T) {
            res.status(400).json({ error: `Unknown table: ${table}` });
            return;
        }
        const traitKey = TRAIT_MAP[trait.trim()] ?? trait.trim();
        const entry = TraitsDict[traitKey];
        if (!entry) {
            res.status(400).json({ error: `Unknown trait: ${trait}` });
            return;
        }
        const [fn, size] = entry;
        const seq = fn(T, size);
        const tex = entry[2];
        res.json({ seq: seq.map(String), tex });
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

// Return the first 10 rows as a triangle and as an array (diagonals)
// Body: { table: string }
// Returns: { tab: string[][], array: string[][] }
app.post('/triangle', (req, res) => {
    try {
        const { table } = req.body as { table: string };
        const T = TABLES[table.trim()];
        if (!T) {
            res.status(400).json({ error: `Unknown table: ${table}` });
            return;
        }
        const size = 8;
        const tab   = T.tab(size).map(r => r.map(String));
        const array = Array.from({ length: size }, (_, n) =>
            T.diag(n, size).map(String)
        );
        res.json({ tab, array, tex: T.tex ? `\\(${T.tex}\\)` : '' });
    } catch (err) {
        res.status(500).json({ error: String(err) });
    }
});

if (!process.env.VERCEL) {
    const port = Number(process.env.PORT) || 3000;
    app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
}

export default app;
