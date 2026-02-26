import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, DoorOpen, ChevronRight, BedDouble, Maximize2, Layers, Building2, FilterX } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import type { LotType } from '../data/types';
import AdvancedFilter, { applyFilters, type FilterRule, type ColumnDef } from '../components/AdvancedFilter';
import Modal from '../components/Modal';
import LotForm from '../components/forms/LotForm';

const getTypeLabel = (t: string) => {
  const map: Record<string, string> = { appartement: 'Appartement', maison: 'Maison', box_parking: 'Box Parking', bureau: 'Bureau', local_commercial: 'Local Commercial', autre: 'Autre' };
  return map[t] || t;
};

const FILTER_COLUMNS: ColumnDef[] = [
  { key: 'type_bien', label: 'Type', type: 'string' },
  { key: 'batimentName', label: 'Batiment', type: 'string' },
  { key: 'etage', label: 'Etage', type: 'string' },
  { key: 'surface', label: 'Surface', type: 'number' },
  { key: 'nb_pieces', label: 'Pieces', type: 'number' },
];

export default function Lots() {
  const { lots, getBatimentById } = useData();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<LotType | 'Tous'>('Tous');
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const enrichedLots = useMemo(() => {
    return lots.filter(l => !l.archived).map(l => {
      const bat = getBatimentById(l.batiment_id);
      return { ...l, batimentName: bat?.designation || '', batimentAddr: bat?.adresses[0] ? `${bat.adresses[0].ville}` : '' };
    });
  }, [lots, getBatimentById]);

  const filtered = useMemo(() => {
    let result = enrichedLots.filter(l => {
      const matchType = typeFilter === 'Tous' || l.type_bien === typeFilter;
      const matchSearch = l.batimentName.toLowerCase().includes(search.toLowerCase()) || (l.numero || '').toLowerCase().includes(search.toLowerCase()) || l.type_bien.toLowerCase().includes(search.toLowerCase());
      return matchType && matchSearch;
    });
    result = applyFilters(result, filterRules, FILTER_COLUMNS);
    return result;
  }, [enrichedLots, typeFilter, search, filterRules]);

  return (
    <div>
      <header className="pb-8 border-b border-slate-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-900">Lots</h1>
            <p className="text-slate-500 text-sm mt-1">Tous les lots de votre parc immobilier</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2.5 w-64 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-slate-400" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"><Plus size={18} /> Nouveau lot</button>
          </div>
        </div>
      </header>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 p-1 bg-slate-100/50 rounded-xl border border-slate-200/60 w-fit">
          {(['Tous', 'appartement', 'maison', 'box_parking', 'bureau', 'local_commercial'] as const).map(type => (
            <button key={type} onClick={() => setTypeFilter(type)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${typeFilter === type ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'}`}>
              {type === 'Tous' ? 'Tous' : getTypeLabel(type)}
            </button>
          ))}
        </div>
        <AdvancedFilter columns={FILTER_COLUMNS} rules={filterRules} onChange={setFilterRules} />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Lot</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Batiment</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Etage</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Surface</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Pieces</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length > 0 ? filtered.map(lot => (
              <tr key={lot.id} className="group hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors border border-slate-200/50">
                      <DoorOpen size={16} />
                    </div>
                    <div>
                      <Link to={`/lots/${lot.id}`} className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                        {lot.numero ? `Lot ${lot.numero}` : 'Lot'} — {getTypeLabel(lot.type_bien)}
                      </Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        {lot.meuble && <span className="flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-100"><BedDouble className="w-3 h-3" /> Meuble</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Building2 size={14} className="text-slate-400" />
                    <Link to={`/batiments/${lot.batiment_id}`} className="hover:text-blue-600 transition-colors">{lot.batimentName}</Link>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{lot.batimentAddr}</div>
                </td>
                <td className="px-6 py-5"><span className="text-sm font-medium text-slate-600">{lot.etage || '—'}</span></td>
                <td className="px-6 py-5"><div className="flex items-center gap-2"><Maximize2 className="w-3.5 h-3.5 text-slate-300" /><span className="text-sm font-semibold text-slate-900">{lot.surface ? `${lot.surface} m2` : '—'}</span></div></td>
                <td className="px-6 py-5"><div className="flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-slate-300" /><span className="text-sm text-slate-600">{lot.nb_pieces || '—'}</span></div></td>
                <td className="px-6 py-5 text-right">
                  <Link to={`/lots/${lot.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-blue-600 rounded-lg bg-blue-50 inline-flex"><ChevronRight size={18} /></Link>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="px-6 py-20 text-center">
                <div className="flex flex-col items-center gap-3 text-slate-400"><FilterX size={48} strokeWidth={1} /><p className="text-sm">Aucun lot trouve.</p>
                  <button onClick={() => { setSearch(''); setTypeFilter('Tous'); setFilterRules([]); }} className="text-blue-600 text-sm font-medium hover:underline">Reinitialiser</button>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Total: {filtered.length} lots</span>
        </div>
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nouveau lot" size="lg">
        <LotForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
}
