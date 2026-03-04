import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, MapPin, User, CalendarCheck, CheckCircle2, Clock, Pencil, Archive } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const TYPE_CONFIG = {
  entree: { label: 'EDL Entree', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  sortie: { label: 'EDL Sortie', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  inventaire: { label: 'Inventaire', color: 'bg-purple-50 text-purple-700 border-purple-200' },
};

const STATUS_CONFIG = {
  brouillon: { label: 'Brouillon', color: 'bg-slate-50 text-slate-600 border-slate-200', icon: Pencil },
  en_cours: { label: 'En cours', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  signe: { label: 'Signe', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  archive: { label: 'Archive', color: 'bg-violet-50 text-violet-700 border-violet-200', icon: Archive },
};

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const { getEdlById, getLotById, getBatimentById, getUserById, getTiersById, getMissionById } = useData();

  const edl = useMemo(() => id ? getEdlById(id) : undefined, [id, getEdlById]);
  const lot = useMemo(() => edl ? getLotById(edl.lot_id) : undefined, [edl, getLotById]);
  const batiment = useMemo(() => lot ? getBatimentById(lot.batiment_id) : undefined, [lot, getBatimentById]);
  const tech = useMemo(() => edl?.technicien_id ? getUserById(edl.technicien_id) : undefined, [edl, getUserById]);
  const mission = useMemo(() => edl?.mission_id ? getMissionById(edl.mission_id) : undefined, [edl, getMissionById]);
  const locataires = useMemo(() => edl ? edl.locataires.map(lid => getTiersById(lid)).filter(Boolean) : [], [edl, getTiersById]);

  if (!edl) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <FileText className="w-16 h-16 text-slate-200 mb-4" />
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Document introuvable</h1>
        <Link to="/documents" className="text-blue-600 hover:underline text-sm font-medium">Retour aux documents</Link>
      </div>
    );
  }

  const typeCfg = TYPE_CONFIG[edl.type as keyof typeof TYPE_CONFIG];
  const statusCfg = STATUS_CONFIG[edl.statut as keyof typeof STATUS_CONFIG];
  const StatusIcon = statusCfg?.icon || Clock;

  return (
    <div>
      <Link to="/documents" className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        Retour aux documents
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${typeCfg?.color || ''}`}>
            {typeCfg?.label || edl.type}
          </span>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase ${statusCfg?.color || ''}`}>
            <StatusIcon size={14} />{statusCfg?.label || edl.statut}
          </div>
        </div>
        <h1 className="text-3xl font-light tracking-tight text-slate-900 mb-2">
          {typeCfg?.label || edl.type}
          {lot && <span className="text-slate-400"> — Lot {lot.numero || ''}</span>}
        </h1>
        {batiment && (
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <MapPin className="w-4 h-4 text-slate-400" />
            {batiment.adresses[0]?.rue}, {batiment.adresses[0]?.code_postal} {batiment.adresses[0]?.ville}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Lot section */}
          {lot && (
            <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-8">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Lot</h3>
              <Link to={`/lots/${lot.id}`} className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                  <MapPin size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors">
                    Lot {lot.numero || ''} — {lot.type_bien}
                  </p>
                  {batiment && <p className="text-xs text-slate-500">{batiment.designation}</p>}
                </div>
              </Link>
            </section>
          )}

          {/* Locataires */}
          <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-8">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Locataire(s)</h3>
            <div className="space-y-3">
              {locataires.length > 0 ? locataires.map(l => l && (
                <Link to={`/tiers/${l.id}`} key={l.id} className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{l.type_personne === 'morale' ? l.raison_sociale : `${l.prenom} ${l.nom}`}</p>
                    <p className="text-[10px] font-bold uppercase text-emerald-600">Locataire</p>
                  </div>
                </Link>
              )) : (
                <p className="text-sm text-slate-400 italic">Aucun locataire lie</p>
              )}
            </div>
          </section>

          {/* Mission liee */}
          {mission && (
            <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-8">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Mission liee</h3>
              <Link to={`/missions/${mission.id}`} className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                  <CalendarCheck size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-mono font-bold text-blue-600">{mission.reference}</p>
                  <p className="text-sm font-medium text-slate-900">{mission.date_planifiee}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${mission.statut === 'terminee' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : mission.statut === 'a_assigner' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                  {mission.statut}
                </span>
              </Link>
            </section>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl p-6 text-white">
            <h4 className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-4">Statut</h4>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase ${statusCfg?.color || ''}`}>
              <StatusIcon size={14} />{statusCfg?.label || edl.statut}
            </div>
            <div className="mt-6 space-y-4">
              {tech && (
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">Technicien</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
                      {tech.prenom[0]}{tech.nom[0]}
                    </div>
                    <span className="text-sm font-medium">{tech.prenom} {tech.nom}</span>
                  </div>
                </div>
              )}
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Date realisation</p>
                <p className="text-sm font-mono">{edl.date_realisation || 'Non realise'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
