import { useState, useMemo } from 'react';
import { Calendar, List, Plus, Search, ChevronLeft, ChevronRight, Clock, MapPin, FileText, Filter, CheckCircle2, Timer, XCircle } from 'lucide-react';
import { format, parseISO, startOfWeek, addDays, isSameDay, isWithinInterval, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { useRole } from '../contexts/RoleContext';
import AdvancedFilter, { applyFilters, type FilterRule, type ColumnDef } from '../components/AdvancedFilter';
import Modal from '../components/Modal';
import MissionForm from '../components/forms/MissionForm';

type ViewMode = 'list' | 'calendar';
type StatusFilter = 'toutes' | 'planifiee' | 'en_cours' | 'terminee' | 'annulee';

const STATUS_CONFIG = {
  planifiee: { label: 'Planifiee', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Calendar },
  en_cours: { label: 'En cours', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Timer },
  terminee: { label: 'Terminee', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  annulee: { label: 'Annulee', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle },
};

const CRENEAU_LABELS: Record<string, string> = { matin: 'Matin', apres_midi: 'Apres-midi', journee: 'Journee', custom: 'Custom' };

const FILTER_COLUMNS: ColumnDef[] = [
  { key: 'reference', label: 'Reference', type: 'string' },
  { key: 'lotLabel', label: 'Lot', type: 'string' },
  { key: 'batimentName', label: 'Batiment', type: 'string' },
  { key: 'date_planifiee', label: 'Date', type: 'date' },
  { key: 'statut', label: 'Statut', type: 'string' },
];

export default function Missions() {
  const { missions, getLotById, getBatimentById, getUserById } = useData();
  const { role, currentUserId } = useRole();

  const [view, setView] = useState<ViewMode>('list');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('toutes');
  const [periodFilter, setPeriodFilter] = useState<'semaine' | 'mois'>('mois');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 26));
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const enrichedMissions = useMemo(() => {
    const base = role === 'technicien'
      ? missions.filter(m => m.techniciens.includes(currentUserId))
      : missions;

    return base.map(m => {
      const lot = getLotById(m.lot_id);
      const batiment = lot ? getBatimentById(lot.batiment_id) : null;
      const techs = m.techniciens.map(id => getUserById(id)).filter(Boolean);
      return {
        ...m,
        lotLabel: lot ? `${lot.numero ? 'Lot ' + lot.numero : 'Lot'} — ${lot.type_bien}` : 'Lot inconnu',
        batimentName: batiment ? batiment.designation : '',
        batimentAddr: batiment?.adresses[0] ? `${batiment.adresses[0].rue}, ${batiment.adresses[0].code_postal} ${batiment.adresses[0].ville}` : '',
        techNames: techs.map(t => t!),
      };
    });
  }, [missions, role, currentUserId, getLotById, getBatimentById, getUserById]);

  const filteredMissions = useMemo(() => {
    let result = enrichedMissions.filter(m => {
      const statusMatch = statusFilter === 'toutes' || m.statut === statusFilter;
      const missionDate = parseISO(m.date_planifiee);
      let periodMatch = true;
      if (periodFilter === 'semaine') {
        periodMatch = isWithinInterval(missionDate, { start: startOfWeek(currentDate, { weekStartsOn: 1 }), end: endOfWeek(currentDate, { weekStartsOn: 1 }) });
      } else {
        periodMatch = isWithinInterval(missionDate, { start: startOfMonth(currentDate), end: endOfMonth(currentDate) });
      }
      return statusMatch && periodMatch;
    });
    result = applyFilters(result, filterRules, FILTER_COLUMNS);
    return result;
  }, [enrichedMissions, statusFilter, periodFilter, currentDate, filterRules]);

  return (
    <div>
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-slate-900">Missions</h1>
          <p className="text-slate-500 text-sm mt-1">
            {role === 'technicien' ? 'Mes missions assignees' : 'Planification des interventions terrain'}
          </p>
        </div>
        {role === 'admin' && (
          <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-all font-medium text-sm">
            <Plus size={18} /> Nouvelle mission
          </button>
        )}
      </header>

      {/* Stats — moved from footer to top */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Missions', val: filteredMissions.length, icon: List, color: 'text-slate-600' },
          { label: 'Planifiees', val: filteredMissions.filter(m => m.statut === 'planifiee').length, icon: Calendar, color: 'text-blue-600' },
          { label: 'Terminees', val: filteredMissions.filter(m => m.statut === 'terminee').length, icon: CheckCircle2, color: 'text-emerald-600' },
          { label: 'EDL lies', val: filteredMissions.reduce((acc, m) => acc + m.edl_ids.length, 0), icon: FileText, color: 'text-violet-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4">
            <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}><stat.icon size={20} /></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-slate-900 leading-none">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-slate-100 rounded-lg w-fit">
            <button onClick={() => setView('list')} className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-medium text-sm ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>
              <List size={18} /> Liste
            </button>
            <button onClick={() => setView('calendar')} className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-medium text-sm ${view === 'calendar' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>
              <Calendar size={18} /> Calendrier
            </button>
          </div>
          <AdvancedFilter columns={FILTER_COLUMNS} rules={filterRules} onChange={setFilterRules} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(['toutes', 'planifiee', 'en_cours', 'terminee', 'annulee'] as StatusFilter[]).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${statusFilter === s ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
              {s === 'toutes' ? 'Toutes' : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG]?.label || s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1">
            <button onClick={() => setPeriodFilter('semaine')} className={`px-3 py-1 text-xs font-bold rounded ${periodFilter === 'semaine' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>SEMAINE</button>
            <button onClick={() => setPeriodFilter('mois')} className={`px-3 py-1 text-xs font-bold rounded ${periodFilter === 'mois' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}>MOIS</button>
          </div>
          <button onClick={() => setCurrentDate(addDays(currentDate, periodFilter === 'semaine' ? -7 : -30))} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 border border-slate-200"><ChevronLeft size={16} /></button>
          <button onClick={() => setCurrentDate(addDays(currentDate, periodFilter === 'semaine' ? 7 : 30))} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 border border-slate-200"><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Reference</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Lot & Emplacement</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Planification</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Equipe</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Statut</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">EDL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMissions.length > 0 ? filteredMissions.map((m) => {
                  const cfg = STATUS_CONFIG[m.statut as keyof typeof STATUS_CONFIG];
                  const StatusIcon = cfg?.icon || Calendar;
                  return (
                    <tr key={m.id} className="group hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-5"><span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">{m.reference}</span></td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 text-sm">{m.lotLabel}</span>
                          <div className="flex items-center gap-1 text-slate-400 text-xs"><MapPin size={12} />{m.batimentName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-slate-700">{format(parseISO(m.date_planifiee), 'EEEE d MMMM', { locale: fr })}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-slate-100 text-slate-600 border-slate-200">{CRENEAU_LABELS[m.creneau] || m.creneau}</span>
                            {m.heure_debut && <span className="text-xs text-slate-400">{m.heure_debut} - {m.heure_fin}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex -space-x-2">
                          {m.techNames.map((user, idx) => (
                            <div key={idx} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600" title={`${user.prenom} ${user.nom}`}>
                              {user.prenom[0]}{user.nom[0]}
                            </div>
                          ))}
                          {m.techNames.length === 0 && <span className="text-xs text-slate-400 italic">Non assigne</span>}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wide ${cfg?.color || ''}`}>
                          <StatusIcon size={14} />{cfg?.label || m.statut}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 text-slate-400"><FileText size={18} /><span className="text-sm font-bold">{m.edl_ids.length}</span></div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <Search size={48} className="mb-4 text-slate-300" />
                      <p className="text-lg font-medium text-slate-400">Aucune mission pour cette periode</p>
                    </div>
                  </td></tr>
                )}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden">
            {Array.from({ length: 7 }).map((_, idx) => {
              const day = addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), idx);
              const dayMissions = filteredMissions.filter(m => isSameDay(parseISO(m.date_planifiee), day));
              const isToday = isSameDay(day, new Date(2026, 1, 26));
              return (
                <div key={idx} className="bg-slate-50 min-h-[400px] flex flex-col">
                  <div className={`p-4 border-b border-slate-200 ${isToday ? 'bg-blue-50/50' : 'bg-white'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>{format(day, 'EEEE', { locale: fr })}</p>
                    <p className={`text-xl font-light ${isToday ? 'text-blue-700 font-bold' : 'text-slate-900'}`}>{format(day, 'd')}</p>
                  </div>
                  <div className="flex-1 p-2 flex flex-col gap-2">
                    {dayMissions.map(m => (
                      <div key={m.id} className="bg-white p-3 rounded-lg border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-1 h-full ${m.statut === 'planifiee' ? 'bg-blue-500' : m.statut === 'en_cours' ? 'bg-amber-500' : m.statut === 'terminee' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-mono text-[9px] font-bold text-blue-600">{m.reference}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">{CRENEAU_LABELS[m.creneau] || m.heure_debut}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 truncate">{m.lotLabel}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1"><MapPin size={10} />{m.batimentName}</p>
                      </div>
                    ))}
                    {dayMissions.length === 0 && <div className="h-full border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center opacity-20"><Clock size={20} className="text-slate-400" /></div>}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nouvelle mission" size="lg">
        <MissionForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
}
