import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, FileText, CheckCircle2, Clock, Pencil, Archive, User, MapPin } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import AdvancedFilter, { applyFilters, type FilterRule, type ColumnDef } from '../components/AdvancedFilter';

const STATUS_CONFIG = {
  brouillon: { label: 'Brouillon', color: 'bg-slate-50 text-slate-600 border-slate-200', icon: Pencil },
  en_cours: { label: 'En cours', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  signe: { label: 'Signe', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  archive: { label: 'Archive', color: 'bg-violet-50 text-violet-700 border-violet-200', icon: Archive },
};

const FILTER_COLUMNS: ColumnDef[] = [
  { key: 'type', label: 'Type', type: 'string' },
  { key: 'statut', label: 'Statut', type: 'string' },
  { key: 'lot_label', label: 'Lot', type: 'string', accessor: (e: any) => e.lot ? `Lot ${e.lot.numero || ''} — ${e.lot.type_bien}` : '' },
  { key: 'technicien_name', label: 'Technicien', type: 'string', accessor: (e: any) => e.tech ? `${e.tech.prenom} ${e.tech.nom}` : '' },
  { key: 'date_realisation', label: 'Date', type: 'date' },
];

export default function EdlList() {
  const { edls, getLotById, getBatimentById, getUserById, getTiersById } = useData();
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);

  const enrichedEdls = useMemo(() => {
    return edls.map(edl => {
      const lot = getLotById(edl.lot_id);
      const batiment = lot ? getBatimentById(lot.batiment_id) : null;
      const tech = edl.technicien_id ? getUserById(edl.technicien_id) : null;
      const locataires = edl.locataires.map(id => getTiersById(id)).filter(Boolean);
      return { ...edl, lot, batiment, tech, locataireNames: locataires.map(l => l!.type_personne === 'morale' ? l!.raison_sociale : `${l!.prenom} ${l!.nom}`) };
    });
  }, [edls, getLotById, getBatimentById, getUserById, getTiersById]);

  const filteredEdls = useMemo(() => {
    return applyFilters(enrichedEdls, filterRules, FILTER_COLUMNS);
  }, [enrichedEdls, filterRules]);

  return (
    <div>
      <header className="pb-8 border-b border-slate-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-900">Etats des lieux</h1>
            <p className="text-slate-500 text-sm mt-1">Tous les EDL de votre workspace</p>
          </div>
          <div className="flex items-center gap-3">
            <AdvancedFilter columns={FILTER_COLUMNS} rules={filterRules} onChange={setFilterRules} />
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <FileText size={18} /> Nouvel EDL
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', val: edls.length, color: 'text-slate-600' },
          { label: 'Brouillons', val: edls.filter(e => e.statut === 'brouillon').length, color: 'text-slate-500' },
          { label: 'Signes', val: edls.filter(e => e.statut === 'signe').length, color: 'text-emerald-600' },
          { label: 'Entrees', val: edls.filter(e => e.type === 'entree').length, color: 'text-blue-600' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
            <ClipboardList size={18} className={s.color} />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className="text-lg font-bold text-slate-900">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Lot & Batiment</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Locataire(s)</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Technicien</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredEdls.map(edl => {
              const cfg = STATUS_CONFIG[edl.statut as keyof typeof STATUS_CONFIG];
              const StatusIcon = cfg?.icon || Clock;
              return (
                <tr key={edl.id} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-5">
                    <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full border ${edl.type === 'entree' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                      {edl.type === 'entree' ? 'Entree' : 'Sortie'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">
                        {edl.lot ? `Lot ${edl.lot.numero || ''}` : 'Lot'} — {edl.lot?.type_bien || ''}
                      </span>
                      {edl.batiment && (
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} />{edl.batiment.designation}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <User size={14} className="text-slate-400" />
                      {edl.locataireNames.length > 0 ? edl.locataireNames.join(', ') : <span className="italic text-slate-400">—</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {edl.tech ? (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">{edl.tech.prenom[0]}{edl.tech.nom[0]}</div>
                        <span className="text-sm text-slate-600">{edl.tech.prenom} {edl.tech.nom}</span>
                      </div>
                    ) : <span className="text-sm text-slate-400 italic">Non assigne</span>}
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase ${cfg?.color || ''}`}>
                      <StatusIcon size={14} />{cfg?.label || edl.statut}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-slate-500 font-mono">{edl.date_realisation || '—'}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
