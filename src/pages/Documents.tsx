import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, CheckCircle2, Clock, Pencil, Archive, User, MapPin, Search } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import AdvancedFilter, { applyFilters, type FilterRule, type ColumnDef } from '../components/AdvancedFilter';
import DataTable, { type Column } from '../components/DataTable';
import type { EdlStatus } from '../data/types';

const STATUS_CONFIG = {
  brouillon: { label: 'Brouillon', color: 'bg-slate-50 text-slate-600 border-slate-200', icon: Pencil },
  en_cours: { label: 'En cours', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  signe: { label: 'Signe', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  archive: { label: 'Archive', color: 'bg-violet-50 text-violet-700 border-violet-200', icon: Archive },
};

const TYPE_CONFIG = {
  entree: { label: 'EDL Entree', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  sortie: { label: 'EDL Sortie', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  inventaire: { label: 'Inventaire', color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

const FILTER_COLUMNS: ColumnDef[] = [
  { key: 'type', label: 'Type', type: 'string' },
  { key: 'statut', label: 'Statut', type: 'string' },
  { key: 'lot_label', label: 'Lot', type: 'string', accessor: (e: any) => e.lot ? `Lot ${e.lot.numero || ''} — ${e.lot.type_bien}` : '' },
  { key: 'technicien_name', label: 'Technicien', type: 'string', accessor: (e: any) => e.tech ? `${e.tech.prenom} ${e.tech.nom}` : '' },
  { key: 'date_realisation', label: 'Date', type: 'date' },
];

type StatusFilterType = 'tous' | EdlStatus;

type EnrichedEdl = ReturnType<typeof enrichEdl>;

function enrichEdl(edl: any, getLotById: any, getBatimentById: any, getUserById: any, getTiersById: any) {
  const lot = getLotById(edl.lot_id);
  const batiment = lot ? getBatimentById(lot.batiment_id) : null;
  const tech = edl.technicien_id ? getUserById(edl.technicien_id) : null;
  const locataires = edl.locataires.map((id: string) => getTiersById(id)).filter(Boolean);
  return {
    ...edl,
    lot,
    batiment,
    tech,
    locataireNames: locataires.map((l: any) => l.type_personne === 'morale' ? l.raison_sociale : `${l.prenom} ${l.nom}`),
  };
}

export default function Documents() {
  const { edls, getLotById, getBatimentById, getUserById, getTiersById } = useData();
  const navigate = useNavigate();
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('tous');

  const enrichedEdls = useMemo(() => {
    return edls.map(edl => enrichEdl(edl, getLotById, getBatimentById, getUserById, getTiersById));
  }, [edls, getLotById, getBatimentById, getUserById, getTiersById]);

  const filteredEdls = useMemo(() => {
    let result = enrichedEdls;
    if (statusFilter !== 'tous') {
      result = result.filter(e => e.statut === statusFilter);
    }
    result = applyFilters(result, filterRules, FILTER_COLUMNS);
    return result;
  }, [enrichedEdls, statusFilter, filterRules]);

  const columns: Column<EnrichedEdl>[] = [
    {
      key: 'type',
      label: 'Type',
      minWidth: 120,
      render: (edl) => {
        const cfg = TYPE_CONFIG[edl.type as keyof typeof TYPE_CONFIG];
        return (
          <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${cfg?.color || ''}`}>
            {cfg?.label || edl.type}
          </span>
        );
      },
    },
    {
      key: 'lot',
      label: 'Lot & Batiment',
      minWidth: 180,
      render: (edl) => (
        <div className="flex flex-col">
          <Link
            to={edl.lot ? `/lots/${edl.lot.id}` : '#'}
            onClick={(e) => e.stopPropagation()}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            {edl.lot ? `Lot ${edl.lot.numero || ''}` : 'Lot'} — {edl.lot?.type_bien || ''}
          </Link>
          {edl.batiment && (
            <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin size={12} />{edl.batiment.designation}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'locataires',
      label: 'Locataire(s)',
      minWidth: 140,
      render: (edl) => (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <User size={14} className="text-slate-400" />
          {edl.locataireNames.length > 0 ? edl.locataireNames.join(', ') : <span className="italic text-slate-400">—</span>}
        </div>
      ),
    },
    {
      key: 'technicien',
      label: 'Technicien',
      minWidth: 140,
      render: (edl) => edl.tech ? (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">{edl.tech.prenom[0]}{edl.tech.nom[0]}</div>
          <span className="text-sm text-slate-600">{edl.tech.prenom} {edl.tech.nom}</span>
        </div>
      ) : <span className="text-sm text-slate-400 italic">Non assigne</span>,
    },
    {
      key: 'statut',
      label: 'Statut',
      minWidth: 120,
      render: (edl) => {
        const cfg = STATUS_CONFIG[edl.statut as keyof typeof STATUS_CONFIG];
        const StatusIcon = cfg?.icon || Clock;
        return (
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase ${cfg?.color || ''}`}>
            <StatusIcon size={14} />{cfg?.label || edl.statut}
          </div>
        );
      },
    },
    {
      key: 'date',
      label: 'Date',
      minWidth: 100,
      render: (edl) => <span className="text-sm text-slate-500 font-mono">{edl.date_realisation || '—'}</span>,
    },
  ];

  return (
    <div>
      <header className="pb-8 border-b border-slate-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-900">Documents</h1>
            <p className="text-slate-500 text-sm mt-1">EDL et inventaires de votre workspace</p>
          </div>
          <div className="flex items-center gap-3">
            <AdvancedFilter columns={FILTER_COLUMNS} rules={filterRules} onChange={setFilterRules} />
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <FileText size={18} /> Nouveau document
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total', val: edls.length, color: 'text-slate-600' },
          { label: 'EDL Entree', val: edls.filter(e => e.type === 'entree').length, color: 'text-blue-600' },
          { label: 'EDL Sortie', val: edls.filter(e => e.type === 'sortie').length, color: 'text-orange-600' },
          { label: 'Inventaires', val: edls.filter(e => e.type === 'inventaire').length, color: 'text-purple-600' },
          { label: 'Signes', val: edls.filter(e => e.statut === 'signe').length, color: 'text-emerald-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
            <FileText size={18} className={s.color} />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-lg font-bold text-slate-900">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {(['tous', 'brouillon', 'en_cours', 'signe', 'archive'] as StatusFilterType[]).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${statusFilter === s ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
          >
            {s === 'tous' ? 'Tous' : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label || s}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filteredEdls}
        onRowClick={(edl) => navigate(`/documents/${edl.id}`)}
        emptyIcon={<Search size={48} className="text-slate-300" />}
        emptyMessage="Aucun document trouve"
      />
    </div>
  );
}
