import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CalendarCheck, MapPin, Calendar, Timer, CheckCircle2, XCircle, UserPlus, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useData } from '../contexts/DataContext';

const STATUS_CONFIG = {
  planifiee: { label: 'Planifiee', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Calendar },
  a_assigner: { label: 'A assigner', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: UserPlus },
  en_cours: { label: 'En cours', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Timer },
  terminee: { label: 'Terminee', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  annulee: { label: 'Annulee', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: XCircle },
};

const CRENEAU_LABELS: Record<string, string> = { matin: 'Matin (8h-12h)', apres_midi: 'Apres-midi (14h-18h)', journee: 'Journee (8h-18h)', custom: 'Horaire personnalise' };

const TYPE_CONFIG = {
  entree: { label: 'EDL Entree', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  sortie: { label: 'EDL Sortie', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  inventaire: { label: 'Inventaire', color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

const DOC_STATUS_CONFIG = {
  brouillon: { label: 'Brouillon', color: 'bg-slate-100 text-slate-600' },
  en_cours: { label: 'En cours', color: 'bg-amber-100 text-amber-700' },
  signe: { label: 'Signe', color: 'bg-emerald-100 text-emerald-700' },
  archive: { label: 'Archive', color: 'bg-violet-100 text-violet-700' },
};

export default function MissionDetail() {
  const { id } = useParams<{ id: string }>();
  const { getMissionById, getLotById, getBatimentById, getUserById, getEdlsByMission } = useData();

  const mission = useMemo(() => id ? getMissionById(id) : undefined, [id, getMissionById]);
  const lot = useMemo(() => mission ? getLotById(mission.lot_id) : undefined, [mission, getLotById]);
  const batiment = useMemo(() => lot ? getBatimentById(lot.batiment_id) : undefined, [lot, getBatimentById]);
  const techs = useMemo(() => mission ? mission.techniciens.map(tid => getUserById(tid)).filter(Boolean) : [], [mission, getUserById]);
  const linkedEdls = useMemo(() => mission ? getEdlsByMission(mission.id) : [], [mission, getEdlsByMission]);

  if (!mission) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <CalendarCheck className="w-16 h-16 text-slate-200 mb-4" />
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Mission introuvable</h1>
        <Link to="/missions" className="text-blue-600 hover:underline text-sm font-medium">Retour aux missions</Link>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[mission.statut as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusCfg?.icon || Calendar;

  return (
    <div>
      <Link to="/missions" className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Retour aux missions
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2.5 py-0.5 text-xs font-mono font-bold tracking-wider bg-blue-50 text-blue-600 rounded border border-blue-100">
            {mission.reference}
          </span>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase ${statusCfg?.color || ''}`}>
            <StatusIcon size={14} />{statusCfg?.label || mission.statut}
          </div>
        </div>
        <h1 className="text-3xl font-light tracking-tight text-slate-900 mb-2">
          Mission {mission.reference}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 text-sm">
          {lot && (
            <Link to={`/lots/${lot.id}`} className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <MapPin className="w-4 h-4 text-slate-400" />
              Lot {lot.numero || ''} — {lot.type_bien}
            </Link>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            {format(parseISO(mission.date_planifiee), 'EEEE d MMMM yyyy', { locale: fr })}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Lot section */}
          {lot && batiment && (
            <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Lot & Batiment</h3>
              <Link to={`/lots/${lot.id}`} className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                  <MapPin size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">Lot {lot.numero || ''} — {lot.type_bien}</p>
                  <p className="text-xs text-slate-500">{batiment.designation} — {batiment.adresses[0]?.rue}, {batiment.adresses[0]?.code_postal} {batiment.adresses[0]?.ville}</p>
                </div>
              </Link>
            </section>
          )}

          {/* Planning section */}
          <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Planning</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date</dt>
                <dd className="text-sm font-medium text-slate-900">{format(parseISO(mission.date_planifiee), 'EEEE d MMMM yyyy', { locale: fr })}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Creneau</dt>
                <dd className="text-sm font-medium text-slate-900">{CRENEAU_LABELS[mission.creneau] || mission.creneau}</dd>
              </div>
              {mission.heure_debut && (
                <div>
                  <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Horaires</dt>
                  <dd className="text-sm font-medium text-slate-900">{mission.heure_debut} - {mission.heure_fin}</dd>
                </div>
              )}
              <div>
                <dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Technicien(s)</dt>
                <dd className="flex items-center gap-2">
                  {techs.length > 0 ? techs.map((t, i) => t && (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">{t.prenom[0]}{t.nom[0]}</div>
                      <span className="text-sm font-medium text-slate-700">{t.prenom} {t.nom}</span>
                    </div>
                  )) : <span className="text-sm text-amber-500 italic">Non assigne</span>}
                </dd>
              </div>
            </dl>
          </section>

          {/* Commentaire */}
          {mission.commentaire && (
            <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-8">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Commentaire</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{mission.commentaire}</p>
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl p-6 text-white">
            <h4 className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-4">Statut</h4>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase ${statusCfg?.color || ''}`}>
              <StatusIcon size={14} />{statusCfg?.label || mission.statut}
            </div>
          </div>

          {/* Documents lies */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Documents lies ({linkedEdls.length})</h4>
            <div className="space-y-3">
              {linkedEdls.length > 0 ? linkedEdls.map(edl => {
                const tCfg = TYPE_CONFIG[edl.type as keyof typeof TYPE_CONFIG];
                const sCfg = DOC_STATUS_CONFIG[edl.statut as keyof typeof DOC_STATUS_CONFIG];
                return (
                  <Link to={`/documents/${edl.id}`} key={edl.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-slate-400" />
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${tCfg?.color || ''}`}>{tCfg?.label || edl.type}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${sCfg?.color || ''}`}>{sCfg?.label || edl.statut}</span>
                  </Link>
                );
              }) : (
                <p className="text-sm text-slate-400 italic">Aucun document lie</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
