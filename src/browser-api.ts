import { QueryOEIS } from './tabloeis';
import { Table } from './tabltypes';
import { TraitsDict } from './tabltraits';

import { Abel              } from './Abel';
import { AbelInv           } from './AbelInv';
import { Andre             } from './Andre';
import { AndreInv          } from './AndreInv';
import { Baxter            } from './Baxter';
import { BaxterInv         } from './BaxterInv';
import { Bell              } from './Bell';
import { Bessel            } from './Bessel';
import { Bessel2           } from './Bessel2';
import { BesselInv         } from './BesselInv';
import { BinaryPell        } from './BinaryPell';
import { Binomial          } from './Binomial';
import { BinomialBell      } from './BinomialBell';
import { BinomialCatalan   } from './BinomialCatalan';
import { BinomialDiffPell  } from './BinomialDiffPell';
import { BinomialInv       } from './BinomialInv';
import { BinomialPell      } from './BinomialPell';
import { Catalan           } from './Catalan';
import { CatalanInv        } from './CatalanInv';
import { CatalanPaths      } from './CatalanPaths';
import { CentralCycle      } from './CentralCycle';
import { CentralFactorial  } from './CentralFactorial';
import { CentralSet        } from './CentralSet';
import { CentralSetInv     } from './CentralSetInv';
import { Chains            } from './Chains';
import { Charlier          } from './Charlier';
import { ChebyshevS        } from './ChebyshevS';
import { ChebyshevT        } from './ChebyshevT';
import { ChebyshevU        } from './ChebyshevU';
import { CompositionAcc    } from './CompositionAcc';
import { CompositionDist   } from './CompositionDist';
import { CompositionLP     } from './CompositionLP';
import { CTree             } from './CTree';
import { DegSymPoly        } from './DegSymPoly';
import { Delannoy          } from './Delannoy';
import { DelannoyInv       } from './DelannoyInv';
import { Divisibility      } from './Divisibility';
import { DoublePochhammer  } from './DoublePochhammer';
import { DyckPaths         } from './DyckPaths';
import { DyckPathsInv      } from './DyckPathsInv';
import { Entringer         } from './Entringer';
import { EntringerSeidel   } from './EntringerSeidel';
import { Euclid            } from './Euclid';
import { Euler             } from './Euler';
import { Eulerian          } from './Eulerian';
import { Eulerian2         } from './Eulerian2';
import { EulerianB         } from './EulerianB';
import { EulerianRevZigZag } from './EulerianRevZigZag';
import { EulerianZigZag    } from './EulerianZigZag';
import { EulerSec          } from './EulerSec';
import { EulerTan          } from './EulerTan';
import { EytzingerOrder    } from './EytzingerOrder';
import { EytzingerPerm     } from './EytzingerPerm';
import { FallingFactorial  } from './FallingFactorial';
import { FiboLucas         } from './FiboLucas';
import { FiboLucasInv      } from './FiboLucasInv';
import { FiboLucasRev      } from './FiboLucasRev';
import { Fibonacci         } from './Fibonacci';
import { Fubini            } from './Fubini';
import { FussCatalan       } from './FussCatalan';
import { Gaussq2           } from './Gaussq2';
import { Genocchi          } from './Genocchi';
import { Harmonic          } from './Harmonic';
import { HermiteE          } from './HermiteE';
import { HermiteH          } from './HermiteH';
import { HyperHarmonic     } from './HyperHarmonic';
import { Jacobsthal        } from './Jacobsthal';
import { LabeledGraphs     } from './LabeledGraphs';
import { Laguerre          } from './Laguerre';
import { Lah               } from './Lah';
import { LahInv            } from './LahInv';
import { Lehmer            } from './Lehmer';
import { Leibniz           } from './Leibniz';
import { LeibnizTable      } from './LeibnizTable';
import { Levin             } from './Levin';
import { Lozanic           } from './Lozanic';
import { Lucas             } from './Lucas';
import { LucasInv          } from './LucasInv';
import { LucasPoly         } from './LucasPoly';
import { MaxVal            } from './MaxVal';
import { Moebius           } from './Moebius';
import { Monotone          } from './Monotone';
import { Motzkin           } from './Motzkin';
import { MotzkinInv        } from './MotzkinInv';
import { MotzkinPoly       } from './MotzkinPoly';
import { Narayana          } from './Narayana';
import { Narayana2         } from './Narayana2';
import { Naturals          } from './Naturals';
import { Nicomachus        } from './Nicomachus';
import { NimSum            } from './NimSum';
import { One               } from './One';
import { OrderedCycle      } from './OrderedCycle';
import { Ordinals          } from './Ordinals';
import { Parades           } from './Parades';
import { Partition         } from './Partition';
import { PartitionAcc      } from './PartitionAcc';
import { PartitionDist     } from './PartitionDist';
import { PartitionDistSize } from './PartitionDistSize';
import { Pascal            } from './Pascal';
import { PolyaTree         } from './PolyaTree';
import { PolyaTreeAcc      } from './PolyaTreeAcc';
import { Polygonal         } from './Polygonal';
import { Powers            } from './Powers';
import { PowLaguerre       } from './PowLaguerre';
import { Rencontres        } from './Rencontres';
import { RencontresInv     } from './RencontresInv';
import { RisingFactorial   } from './RisingFactorial';
import { RootedTree        } from './RootedTree';
import { Schroeder         } from './Schroeder';
import { SchroederInv      } from './SchroederInv';
import { SchroederL        } from './SchroederL';
import { SchroederP        } from './SchroederP';
import { Sidi              } from './Sidi';
import { Sierpinski        } from './Sierpinski';
import { StirlingCycle     } from './StirlingCycle';
import { StirlingCycle2    } from './StirlingCycle2';
import { StirlingCycleB    } from './StirlingCycleB';
import { StirlingSet       } from './StirlingSet';
import { StirlingSet2      } from './StirlingSet2';
import { StirlingSetB      } from './StirlingSetB';
import { Sylvester         } from './Sylvester';
import { Template          } from './Template';
import { TernaryTrees      } from './TernaryTrees';
import { UpDownWords       } from './UpDownWords';
import { WardCycle         } from './WardCycle';
import { WardSet           } from './WardSet';
import { Worpitzky         } from './Worpitzky';

const TABLES: Record<string, Table> = {
    Abel, AbelInv, Andre, AndreInv, Baxter, BaxterInv, Bell, Bessel,
    Bessel2, BesselInv, BinaryPell, Binomial, BinomialBell, BinomialCatalan, BinomialDiffPell, BinomialInv,
    BinomialPell, Catalan, CatalanInv, CatalanPaths, CentralCycle, CentralFactorial, CentralSet, CentralSetInv,
    Chains, Charlier, ChebyshevS, ChebyshevT, ChebyshevU, CompositionAcc, CompositionDist, CompositionLP,
    CTree, DegSymPoly, Delannoy, DelannoyInv, Divisibility, DoublePochhammer, DyckPaths, DyckPathsInv,
    Entringer, EntringerSeidel, Euclid, Euler, Eulerian, Eulerian2, EulerianB, EulerianRevZigZag,
    EulerianZigZag, EulerSec, EulerTan, EytzingerOrder, EytzingerPerm, FallingFactorial, FiboLucas, FiboLucasInv,
    FiboLucasRev, Fibonacci, Fubini, FussCatalan, Gaussq2, Genocchi, Harmonic, HermiteE,
    HermiteH, HyperHarmonic, Jacobsthal, LabeledGraphs, Laguerre, Lah, LahInv, Lehmer,
    Leibniz, LeibnizTable, Levin, Lozanic, Lucas, LucasInv, LucasPoly, MaxVal,
    Moebius, Monotone, Motzkin, MotzkinInv, MotzkinPoly, Narayana, Narayana2, Naturals,
    Nicomachus, NimSum, One, OrderedCycle, Ordinals, Parades, Partition, PartitionAcc,
    PartitionDist, PartitionDistSize, Pascal, PolyaTree, PolyaTreeAcc, Polygonal, Powers, PowLaguerre,
    Rencontres, RencontresInv, RisingFactorial, RootedTree, Schroeder, SchroederInv, SchroederL, SchroederP,
    Sidi, Sierpinski, StirlingCycle, StirlingCycle2, StirlingCycleB, StirlingSet, StirlingSet2, StirlingSetB,
    Sylvester, Template, TernaryTrees, UpDownWords, WardCycle, WardSet, Worpitzky
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
