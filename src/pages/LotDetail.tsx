import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, DoorOpen, MapPin, Maximize2, Layers, BedDouble, Flame, Droplets, Building2, User, CalendarCheck, ClipboardList } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const label = (t: string) => {
  const m: Record<string, string> = { appartement: 'Appartement', maison: 'Maison', box_parking: 'Box Parking', bureau: 'Bureau', local_commercial: 'Local Commercial', autre: 'Autre', individuel: 'Individuel', collectif: 'Collectif', aucun: 'Aucun', gaz: 'Gaz', electrique: 'Electrique', fioul: 'Fioul', pompe_chaleur: 'Pompe a chaleur' };
  return m[t] || t || '—';
};

export default function LotDetail() {
  const { id } = useParams<{ id: string }>();
  const { getLotById, getBatimentById, getTiersById, getMissionsByLot, getEdlsByLot } = useData();

  const lot = useMemo(() => id ? getLotById(id) : undefined, [id, getLotById]);
  const batiment = useMemo(() => lot ? getBatimentById(lot.batiment_id) : undefined, [lot, getBatimentById]);
  const proprietaires = useMemo(() => lot ? lot.proprietaires.map(pid => getTiersById(pid)).filter(Boolean) : [], [lot, getTiersById]);
  const mandataire = useMemo(() => lot?.mandataire_id ? getTiersById(lot.mandataire_id) : undefined, [lot, getTiersById]);
  const missions = useMemo(() => lot ? getMissionsByLot(lot.id) : [], [lot, getMissionsByLot]);
  const edls = useMemo(() => lot ? getEdlsByLot(lot.id) : [], [lot, getEdlsByLot]);

  if (!lot) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <DoorOpen className="w-16 h-16 text-slate-200 mb-4" />
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Lot introuvable</h1>
        <Link to="/lots" className="text-blue-600 hover:underline text-sm font-medium">Retour aux lots</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to={batiment ? `/batiments/${batiment.id}` : '/lots'} className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        {batiment ? `Retour a ${batiment.designation}` : 'Retour aux lots'}
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-2.5 py-0.5 text-xs font-bold tracking-wider uppercase bg-blue-50 text-blue-600 rounded border border-blue-100">{label(lot.type_bien)}</span>
          {lot.meuble && <span className="flex items-center gap-1 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100"><BedDouble className="w-3 h-3" /> Meuble</span>}
        </div>
        <h1 className="text-3xl font-light tracking-tight text-slate-900 mb-2">
          {lot.numero ? `Lot n${lot.numero}` : 'Lot'} {batiment && `— ${batiment.designation}`}
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
          <section className="bg-white border border-slate-200 rounded-xl p-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Caracteristiques</h3>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
              <div><dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Etage</dt><dd className="text-sm font-medium text-slate-900">{lot.etage || '—'}</dd></div>
              <div><dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Surface</dt><dd className="text-sm font-medium text-slate-900 flex items-center gap-1"><Maximize2 size={14} className="text-slate-300" />{lot.surface ? `${lot.surface} m2` : '—'}</dd></div>
              <div><dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pieces</dt><dd className="text-sm font-medium text-slate-900 flex items-center gap-1"><Layers size={14} className="text-slate-300" />{lot.nb_pieces || '—'}</dd></div>
            </dl>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Informations techniques</h3>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div><dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Flame size={12} /> Chauffage</dt><dd className="text-sm font-medium text-slate-900">{label(lot.chauffage_type || '')} — {label(lot.chauffage_mode || '')}</dd></div>
              <div><dt className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Droplets size={12} /> Eau chaude</dt><dd className="text-sm font-medium text-slate-900">{label(lot.eau_chaude_type || '')} — {label(lot.eau_chaude_mode || '')}</dd></div>
            </dl>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Tiers lies</h3>
            <div className="space-y-4">
              {proprietaires.map(p => p && (
                <Link to={`/tiers/${p.id}`} key={p.id} className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"><User size={16} /></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{p.type_personne === 'morale' ? p.raison_sociale : `${p.prenom} ${p.nom}`}</p>
                    <p className="text-[10px] font-bold uppercase text-blue-600">Proprietaire</p>
                  </div>
                </Link>
              ))}
              {mandataire && (
                <Link to={`/tiers/${mandataire.id}`} className="flex items-center gap-4 p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100"><Building2 size={16} /></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{mandataire.raison_sociale || mandataire.nom}</p>
                    <p className="text-[10px] font-bold uppercase text-amber-600">Mandataire de gestion</p>
                  </div>
                </Link>
              )}
              {proprietaires.length === 0 && !mandataire && <p className="text-sm text-slate-400 italic">Aucun tiers lie</p>}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl p-6 text-white">
            <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">Activite</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <CalendarCheck size={20} className="text-blue-400" />
                <div><p className="text-2xl font-bold">{missions.length}</p><p className="text-slate-400 text-xs">Missions</p></div>
              </div>
              <div className="h-px bg-slate-800" />
              <div className="flex items-center gap-3">
                <ClipboardList size={20} className="text-emerald-400" />
                <div><p className="text-2xl font-bold">{edls.length}</p><p className="text-slate-400 text-xs">Etats des lieux</p></div>
              </div>
            </div>
          </div>

          {missions.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Dernieres missions</h4>
              <div className="space-y-3">
                {missions.slice(0, 3).map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                    <div>
                      <p className="text-xs font-mono font-bold text-blue-600">{m.reference}</p>
                      <p className="text-[10px] text-slate-500">{m.date_planifiee}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${m.statut === 'terminee' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {m.statut}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
