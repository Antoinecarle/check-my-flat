import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Building2, Home, Store, Layers, ChevronRight, FilterX, Archive } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useRole } from '../contexts/RoleContext';
import type { BuildingType } from '../data/types';
import AdvancedFilter, { applyFilters, type FilterRule, type ColumnDef } from '../components/AdvancedFilter';
import Modal from '../components/Modal';
import BatimentForm from '../components/forms/BatimentForm';

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'immeuble': return <Building2 size={16} />;
    case 'maison': return <Home size={16} />;
    case 'local_commercial': return <Store size={16} />;
    case 'mixte': return <Layers size={16} />;
    default: return <Building2 size={16} />;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'immeuble': return 'Immeuble';
    case 'maison': return 'Maison';
    case 'local_commercial': return 'Local Commercial';
    case 'mixte': return 'Mixte';
    default: return type;
  }
};

const FILTER_COLUMNS: ColumnDef[] = [
  { key: 'designation', label: 'Designation', type: 'string' },
  { key: 'type', label: 'Type', type: 'string' },
  { key: 'adresse', label: 'Adresse', type: 'string', accessor: (b: any) => b.adresses?.[0]?.rue || '' },
  { key: 'lots_count', label: 'Nb Lots', type: 'number' },
  { key: 'annee_construction', label: 'Annee', type: 'number' },
];

export default function Batiments() {
  const { batiments } = useData();
  const { role } = useRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<BuildingType | 'Tous'>('Tous');
  const [includeArchived, setIncludeArchived] = useState(false);
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredBatiments = useMemo(() => {
    let result = batiments.filter((b) => {
      const matchesSearch =
        b.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.adresses[0]?.rue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.adresses[0]?.ville.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = activeType === 'Tous' || b.type === activeType;
      const matchesArchived = includeArchived ? true : !b.archived;
      return matchesSearch && matchesType && matchesArchived;
    });
    result = applyFilters(result, filterRules, FILTER_COLUMNS);
    return result;
  }, [batiments, searchTerm, activeType, includeArchived, filterRules]);

  return (
    <div>
      {/* Header */}
      <header className="pb-8 border-b border-slate-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-900">Batiments</h1>
            <p className="text-slate-500 text-sm mt-1">Gerez votre parc immobilier</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2.5 w-64 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {role === 'admin' && (
              <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                <Plus size={18} />
                Nouveau batiment
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 p-1 bg-slate-100/50 rounded-xl border border-slate-200/60">
            {(['Tous', 'immeuble', 'maison', 'local_commercial', 'mixte'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeType === type ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {type === 'Tous' ? 'Tous' : getTypeLabel(type)}
              </button>
            ))}
          </div>
          <AdvancedFilter columns={FILTER_COLUMNS} rules={filterRules} onChange={setFilterRules} />
        </div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex items-center">
            <input type="checkbox" className="peer sr-only" checked={includeArchived} onChange={(e) => setIncludeArchived(e.target.checked)} />
            <div className="w-10 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full peer-checked:translate-x-5 transition-transform"></div>
          </div>
          <span className="text-sm font-medium text-slate-600">Inclure archives</span>
        </label>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider w-1/3">Designation</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Adresse</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Lots</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Annee</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBatiments.length > 0 ? (
              filteredBatiments.map((b) => (
                <tr key={b.id} className="group hover:bg-slate-50/80 transition-colors relative">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors border border-slate-200/50">
                        {getTypeIcon(b.type)}
                      </div>
                      <div className="flex flex-col">
                        <Link to={`/batiments/${b.id}`} className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                          {b.designation}
                        </Link>
                        {b.numero_batiment && <span className="text-xs text-slate-500 font-mono">Bat. {b.numero_batiment}</span>}
                      </div>
                      {b.archived && (
                        <span className="ml-2 text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1">
                          <Archive size={10} /> Archive
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-slate-100 text-slate-700 border-slate-200">
                      {getTypeIcon(b.type)}{getTypeLabel(b.type)}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-slate-600 max-w-[240px] truncate">
                      {b.adresses[0]?.rue}, {b.adresses[0]?.code_postal} {b.adresses[0]?.ville}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-mono font-medium text-slate-900 bg-slate-100 px-2 py-1 rounded">
                      {String(b.lots_count).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-slate-500 font-mono">{b.annee_construction || '—'}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link to={`/batiments/${b.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-blue-600 rounded-lg bg-blue-50 inline-flex">
                      <ChevronRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <FilterX size={48} strokeWidth={1} />
                    <p className="text-sm">Aucun batiment ne correspond a votre recherche.</p>
                    <button onClick={() => { setSearchTerm(''); setActiveType('Tous'); setIncludeArchived(true); setFilterRules([]); }} className="text-blue-600 text-sm font-medium hover:underline">
                      Reinitialiser les filtres
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-slate-400 font-medium uppercase tracking-widest">
        <p>Total: {batiments.filter(b => !b.archived).length} actifs — Affiches: {filteredBatiments.length}</p>
      </div>

      {/* Create modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nouveau batiment">
        <BatimentForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
}
