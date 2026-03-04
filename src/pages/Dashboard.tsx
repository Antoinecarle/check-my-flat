import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  DoorOpen,
  CalendarCheck,
  ChevronRight,
  Clock,
  User,
  MapPin,
  Circle,
  UserPlus,
  ChevronDown,
  Check,
  FileText,
} from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useRole } from '../contexts/RoleContext';
import { users, workspaceUsers } from '../data/fake';
import { format, parseISO, isAfter, isBefore, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

function TechAssignDropdown({ missionId, onAssign }: { missionId: string; onAssign: (missionId: string, techId: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const techs = useMemo(() =>
    workspaceUsers
      .filter(wu => wu.role === 'technicien')
      .map(wu => users.find(u => u.id === wu.user_id))
      .filter(Boolean) as typeof users,
  []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
      >
        <UserPlus size={12} />
        Assigner
        <ChevronDown size={12} />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1">
          {techs.map(tech => (
            <button
              key={tech.id}
              onClick={() => { onAssign(missionId, tech.id); setIsOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600">
                {tech.prenom[0]}{tech.nom[0]}
              </div>
              <span className="text-sm font-medium text-slate-700">{tech.prenom} {tech.nom}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type DashPeriod = 'semaine' | 'mois';

export default function Dashboard() {
  const { batiments, lots, missions, edls, getLotById, getBatimentById, getUserById, updateMission } = useData();
  const { role, currentUser, currentUserId } = useRole();

  const now = new Date(2026, 1, 26);
  const [period, setPeriod] = useState<DashPeriod>('mois');

  const periodInterval = useMemo(() => {
    if (period === 'semaine') return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
    return { start: startOfMonth(now), end: endOfMonth(now) };
  }, [period]);

  const periodMissions = useMemo(() =>
    missions.filter(m => {
      const d = parseISO(m.date_planifiee);
      return isWithinInterval(d, periodInterval);
    }),
  [missions, periodInterval]);

  const periodEdls = useMemo(() =>
    edls.filter(e => {
      const created = parseISO(e.created_at);
      return isWithinInterval(created, periodInterval);
    }),
  [edls, periodInterval]);

  const missionStats = useMemo(() => ({
    planifiee: periodMissions.filter(m => m.statut === 'planifiee').length,
    a_assigner: periodMissions.filter(m => m.statut === 'a_assigner' || m.techniciens.length === 0).length,
    en_cours: periodMissions.filter(m => m.statut === 'en_cours').length,
    terminee: periodMissions.filter(m => m.statut === 'terminee').length,
    total: periodMissions.length,
  }), [periodMissions]);

  const edlStats = useMemo(() => ({
    entree: periodEdls.filter(e => e.type === 'entree').length,
    sortie: periodEdls.filter(e => e.type === 'sortie').length,
    total: periodEdls.filter(e => e.type === 'entree' || e.type === 'sortie').length,
  }), [periodEdls]);

  const inventaireStats = useMemo(() => ({
    total: periodEdls.filter(e => e.type === 'inventaire').length,
  }), [periodEdls]);

  const upcomingMissions = useMemo(() => {
    const future = missions
      .filter(m => {
        const d = parseISO(m.date_planifiee);
        return (m.statut === 'planifiee' || m.statut === 'a_assigner') && (isAfter(d, now) || format(d, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd'));
      })
      .sort((a, b) => a.date_planifiee.localeCompare(b.date_planifiee));
    if (role === 'technicien') return future.filter(m => m.techniciens.includes(currentUserId));
    return future;
  }, [missions, role, currentUserId]);

  const unassignedMissions = useMemo(() =>
    missions.filter(m => (m.statut === 'a_assigner' || m.techniciens.length === 0) && m.statut !== 'terminee' && m.statut !== 'annulee'),
  [missions]);

  const handleAssign = (missionId: string, techId: string) => {
    updateMission(missionId, { techniciens: [techId], statut: 'planifiee' });
  };

  const CRENEAU_LABELS: Record<string, string> = { matin: 'MATIN', apres_midi: 'AM', journee: 'JOUR', custom: 'CUSTOM' };

  const maxMissionStat = Math.max(missionStats.planifiee, missionStats.en_cours, missionStats.terminee, 1);
  const maxEdlStat = Math.max(edlStats.entree, edlStats.sortie, 1);

  return (
    <div>
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-blue-600" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-600/60">Operational</span>
          </div>
          <h1 className="text-3xl font-light tracking-tight text-slate-900">
            {role === 'technicien' ? `Bonjour, ${currentUser.prenom}` : 'Tableau de bord'}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {role === 'technicien' ? 'Vos missions et activite' : "Vue d'ensemble de votre activite"}
          </p>
        </div>
        {role === 'admin' && (
          <div className="flex gap-3">
            <Link to="/missions" className="px-4 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-600 transition-colors">
              Nouvelle Mission
            </Link>
          </div>
        )}
      </header>

      {/* Period toggle + Chart cards */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs uppercase tracking-widest font-black text-slate-900">Statistiques</h2>
          <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-1">
            <button onClick={() => setPeriod('semaine')} className={`px-4 py-1.5 text-xs font-bold rounded transition-all ${period === 'semaine' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Cette semaine</button>
            <button onClick={() => setPeriod('mois')} className={`px-4 py-1.5 text-xs font-bold rounded transition-all ${period === 'mois' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Ce mois</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Missions chart */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarCheck size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Missions</h3>
              </div>
              <span className="text-2xl font-bold text-slate-900">{missionStats.total}</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Planifiees', count: missionStats.planifiee, color: 'bg-blue-500' },
                { label: 'En cours', count: missionStats.en_cours, color: 'bg-amber-500' },
                { label: 'Terminees', count: missionStats.terminee, color: 'bg-emerald-500' },
              ].map(bar => (
                <div key={bar.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{bar.label}</span>
                    <span className="text-xs font-bold text-slate-600">{bar.count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${bar.color} rounded-full transition-all`} style={{ width: `${(bar.count / maxMissionStat) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EDL chart */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-violet-600" />
                <h3 className="text-sm font-bold text-slate-900">EDL</h3>
              </div>
              <span className="text-2xl font-bold text-slate-900">{edlStats.total}</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Entrees', count: edlStats.entree, color: 'bg-blue-500' },
                { label: 'Sorties', count: edlStats.sortie, color: 'bg-orange-500' },
              ].map(bar => (
                <div key={bar.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{bar.label}</span>
                    <span className="text-xs font-bold text-slate-600">{bar.count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${bar.color} rounded-full transition-all`} style={{ width: `${(bar.count / maxEdlStat) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventaires */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Inventaires</h3>
              </div>
              <span className="text-2xl font-bold text-slate-900">{inventaireStats.total}</span>
            </div>
            <p className="text-sm text-slate-500">
              {inventaireStats.total > 0 ? `${inventaireStats.total} inventaire${inventaireStats.total > 1 ? 's' : ''} sur la periode` : 'Aucun inventaire sur la periode'}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Missions a assigner — admin only */}
          {role === 'admin' && unassignedMissions.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-900/10">
                <h2 className="text-xs uppercase tracking-widest font-black text-slate-900 flex items-center gap-2">
                  <Circle size={8} className="fill-amber-500 text-amber-500" />
                  Missions a assigner
                  <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-700 font-bold">{unassignedMissions.length}</span>
                </h2>
              </div>
              <div className="space-y-3">
                {unassignedMissions.map(m => {
                  const lot = getLotById(m.lot_id);
                  const bat = lot ? getBatimentById(lot.batiment_id) : null;
                  return (
                    <div key={m.id} className="bg-white border border-amber-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex flex-col items-center justify-center min-w-[52px] py-1 px-2 border border-slate-200 bg-white text-center rounded">
                          <span className="text-[9px] uppercase font-bold text-slate-400 leading-none">{CRENEAU_LABELS[m.creneau] || m.creneau}</span>
                          <span className="text-xs font-semibold text-slate-900">{format(parseISO(m.date_planifiee), 'd MMM', { locale: fr })}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-mono font-bold text-blue-600">{m.reference}</span>
                          <span className="text-sm font-medium text-slate-900">
                            {lot ? `Lot ${lot.numero || ''} — ${lot.type_bien}` : 'Lot inconnu'}
                          </span>
                          {bat && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <MapPin size={10} />{bat.designation}
                            </span>
                          )}
                        </div>
                      </div>
                      <TechAssignDropdown missionId={m.id} onAssign={handleAssign} />
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Missions a venir */}
          <section>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-900/10">
              <h2 className="text-xs uppercase tracking-widest font-black text-slate-900 flex items-center gap-2">
                <Circle size={8} className="fill-blue-600 text-blue-600" />
                {role === 'technicien' ? 'Mes prochaines missions' : 'Missions a venir'}
                <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold">{upcomingMissions.length}</span>
              </h2>
              <Link to="/missions" className="text-[10px] font-bold uppercase text-blue-600 hover:underline">Voir tout</Link>
            </div>
            <div className="bg-white border border-slate-200 divide-y divide-slate-100">
              {upcomingMissions.length > 0 ? upcomingMissions.slice(0, 5).map(m => {
                const lot = getLotById(m.lot_id);
                const bat = lot ? getBatimentById(lot.batiment_id) : null;
                const techs = m.techniciens.map(id => getUserById(id)).filter(Boolean);
                const addr = bat?.adresses[0] ? `${bat.adresses[0].rue}, ${bat.adresses[0].code_postal} ${bat.adresses[0].ville}` : '';

                return (
                  <Link key={m.id} to={`/missions/${m.id}`} className="group flex flex-col md:flex-row md:items-center justify-between p-4 hover:bg-slate-50 transition-all duration-200">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex flex-col items-center justify-center min-w-[60px] py-1 px-2 border border-slate-200 bg-white text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">{CRENEAU_LABELS[m.creneau] || m.creneau}</span>
                        <span className="text-sm font-semibold text-slate-900">{format(parseISO(m.date_planifiee), 'd MMM', { locale: fr })}</span>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-medium text-blue-600">{m.reference}</span>
                          <span className={`text-[10px] px-2 py-0.5 border rounded-full font-medium ${m.statut === 'a_assigner' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            {m.statut === 'a_assigner' ? 'A assigner' : 'Planifiee'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-slate-900 font-medium text-sm">
                          <MapPin size={14} className="text-slate-400" />
                          {addr || bat?.designation || 'Adresse inconnue'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-8 mt-3 md:mt-0">
                      <div className="flex items-center gap-2">
                        {techs.length > 0 ? techs.map((t, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-[9px] font-bold text-slate-500">
                              {t!.prenom[0]}{t!.nom[0]}
                            </div>
                            <span className="text-xs text-slate-600">{t!.prenom} {t!.nom}</span>
                          </div>
                        )) : (
                          <span className="text-xs text-amber-500 italic">Non assigne</span>
                        )}
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                );
              }) : (
                <div className="p-8 text-center text-sm text-slate-400">Aucune mission a venir</div>
              )}
            </div>
          </section>
        </div>

        <section className="lg:col-span-4">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-900/10">
            <h2 className="text-xs uppercase tracking-widest font-black text-slate-900">Activite recente</h2>
          </div>
          <div className="bg-white border border-slate-200 p-6">
            <ActivityItem title="EDL signe" detail="Lot #4, Residence Les Tilleuls" time="2h" />
            <ActivityItem title="Mission creee" detail="Ref: M-2026-0008 — Neuilly" time="5h" />
            <ActivityItem title="Nouveau tiers" detail="Elena Garcia — Locataire" time="Hier" />
            <ActivityItem title="Batiment ajoute" detail="Centre Commercial Les Halles" time="3 jours" />
            <ActivityItem title="EDL signe" detail="Lot #2, Residence Les Tilleuls" time="5 jours" />
          </div>
        </section>
      </div>
    </div>
  );
}

const ActivityItem = ({ title, detail, time }: { title: string; detail: string; time: string }) => (
  <div className="relative pl-6 pb-6 last:pb-0">
    <div className="absolute left-[3px] top-1.5 bottom-0 w-[1px] bg-slate-200" />
    <div className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 border-[3px] border-[#FDFDFD] box-content" />
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-start gap-2">
        <h4 className="text-sm font-semibold text-slate-900 leading-tight">{title}</h4>
        <span className="text-[10px] whitespace-nowrap text-slate-400 font-medium flex items-center gap-1">
          <Clock size={10} />{time}
        </span>
      </div>
      <p className="text-xs text-slate-500">{detail}</p>
    </div>
  </div>
);
