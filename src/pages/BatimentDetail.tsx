import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Building2, MapPin, Calendar, Maximize2, Layers, Info, ChevronRight, BedDouble, Home } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = { immeuble: 'Immeuble', maison: 'Maison', local_commercial: 'Local Commercial', mixte: 'Mixte', appartement: 'Appartement', box_parking: 'Box Parking', bureau: 'Bureau', autre: 'Autre' };
  return map[type] || type;
};

export default function BatimentDetail() {
  const { id } = useParams<{ id: string }>();
  const { getBatimentById, getLotsByBatiment } = useData();
  const [activeTab, setActiveTab] = useState<'lots' | 'informations'>('lots');

  const batiment = useMemo(() => (id ? getBatimentById(id) : undefined), [id, getBatimentById]);
  const lots = useMemo(() => (id ? getLotsByBatiment(id) : []), [id, getLotsByBatiment]);

  if (!batiment) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building2 className="text-slate-400 w-8 h-8" />
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Batiment introuvable</h1>
        <p className="text-slate-500 mb-8">Le batiment que vous recherchez n'existe pas.</p>
        <Link to="/batiments" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Retour aux batiments
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/batiments" className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Retour aux batiments
      </Link>

      <header className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase bg-blue-50 text-blue-600 rounded border border-blue-100">
              {getTypeLabel(batiment.type)}
            </span>
            {batiment.numero_batiment && (
              <span className="px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase bg-slate-100 text-slate-600 rounded border border-slate-200">
                Bat. {batiment.numero_batiment}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-light tracking-tight text-slate-900 mb-3">{batiment.designation}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-sm">{batiment.adresses[0]?.rue}, {batiment.adresses[0]?.code_postal} {batiment.adresses[0]?.ville}</span>
            </div>
            {batiment.annee_construction && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm">Construit en {batiment.annee_construction}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
            <Pencil className="w-4 h-4" /> Modifier
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all">
            <Plus className="w-4 h-4" /> Nouveau lot
          </button>
        </div>
      </header>

      <div className="border-b border-slate-200 mb-8">
        <div className="flex gap-8">
          {(['lots', 'informations'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-4 text-sm font-semibold transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
              {tab === 'lots' ? 'Lots' : 'Informations'}
              {tab === 'lots' && <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'lots' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{lots.length}</span>}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'lots' ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Lot / Type</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Etage</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Surface</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pieces</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lots.map((lot) => (
                <tr key={lot.id} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {lot.numero ? `Lot n${lot.numero}` : 'Lot'}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                        {getTypeLabel(lot.type_bien)}
                        {lot.meuble && (
                          <span className="flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-100">
                            <BedDouble className="w-3 h-3" /> Meuble
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-sm font-medium text-slate-600">{lot.etage || '—'}</span></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Maximize2 className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-sm font-semibold text-slate-900">{lot.surface ? `${lot.surface} m2` : '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-sm text-slate-600">{lot.nb_pieces ? `${lot.nb_pieces} pieces` : '—'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/lots/${lot.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                      Details <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {lots.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Home className="w-8 h-8 text-slate-200" />
                    <p className="text-slate-400 font-medium">Aucun lot enregistre</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white border border-slate-200 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg"><Info className="w-5 h-5 text-blue-600" /></div>
                <h3 className="text-lg font-bold text-slate-900">Details structurels</h3>
              </div>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div>
                  <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Type</dt>
                  <dd className="text-sm font-medium text-slate-900">{getTypeLabel(batiment.type)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Annee de construction</dt>
                  <dd className="text-sm font-medium text-slate-900">{batiment.annee_construction || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Numero du batiment</dt>
                  <dd className="text-sm font-medium text-slate-900">{batiment.numero_batiment || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Nombre de lots</dt>
                  <dd className="text-sm font-medium text-slate-900">{lots.length} unites</dd>
                </div>
              </dl>
            </section>

            <section className="bg-white border border-slate-200 rounded-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-50 rounded-lg"><MapPin className="w-5 h-5 text-slate-600" /></div>
                <h3 className="text-lg font-bold text-slate-900">Adresses</h3>
              </div>
              <div className="space-y-4">
                {batiment.adresses.map((addr) => (
                  <div key={addr.id} className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 bg-slate-50/30">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-400" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{addr.rue}, {addr.code_postal} {addr.ville}</p>
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-tight mt-1 inline-block">{addr.type}</span>
                      {addr.complement && <p className="text-xs text-slate-500 mt-1">{addr.complement}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div>
            <div className="bg-slate-900 rounded-xl p-6 text-white overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">Statistiques</h4>
                <div className="space-y-6">
                  <div>
                    <p className="text-3xl font-bold">{lots.length}</p>
                    <p className="text-slate-400 text-xs">Lots actifs</p>
                  </div>
                  <div className="h-px bg-slate-800 w-full" />
                  <div>
                    <p className="text-3xl font-bold">{lots.reduce((acc, l) => acc + (l.surface || 0), 0)} m2</p>
                    <p className="text-slate-400 text-xs">Surface totale</p>
                  </div>
                </div>
              </div>
              <Building2 className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
