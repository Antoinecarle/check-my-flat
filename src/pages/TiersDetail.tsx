import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Building2, Mail, Phone, MapPin, FileText, Hash } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import type { TiersRole } from '../data/types';

const getRoleColor = (role: TiersRole) => {
  switch (role) {
    case 'proprietaire': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'mandataire': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'locataire': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
};

const getRoleLabel = (role: TiersRole) => {
  switch (role) { case 'proprietaire': return 'Proprietaire'; case 'mandataire': return 'Mandataire'; case 'locataire': return 'Locataire'; }
};

export default function TiersDetail() {
  const { id } = useParams<{ id: string }>();
  const { getTiersById, lots, batiments } = useData();

  const tier = useMemo(() => id ? getTiersById(id) : undefined, [id, getTiersById]);

  const ownedLots = useMemo(() => tier ? lots.filter(l => l.proprietaires.includes(tier.id)) : [], [tier, lots]);
  const managedLots = useMemo(() => tier ? lots.filter(l => l.mandataire_id === tier.id) : [], [tier, lots]);

  if (!tier) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <User className="w-16 h-16 text-slate-200 mb-4" />
        <h1 className="text-xl font-semibold text-slate-900 mb-2">Tiers introuvable</h1>
        <Link to="/tiers" className="text-blue-600 hover:underline text-sm font-medium">Retour aux tiers</Link>
      </div>
    );
  }

  const displayName = tier.type_personne === 'morale' ? (tier.raison_sociale || tier.nom) : `${tier.prenom} ${tier.nom}`;

  return (
    <div>
      <Link to="/tiers" className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Retour aux tiers
      </Link>

      <header className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className={`w-16 h-16 flex items-center justify-center rounded-xl border-2 ${tier.type_personne === 'morale' ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-blue-50 border-blue-100 text-blue-500'}`}>
            {tier.type_personne === 'morale' ? <Building2 className="w-8 h-8" /> : <User className="w-8 h-8" />}
          </div>
          <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-900 mb-2">{displayName}</h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase py-1 px-2 border border-slate-200 text-slate-500 bg-white rounded">{tier.type_personne === 'morale' ? 'Personne Morale' : 'Personne Physique'}</span>
              {tier.roles.map(role => (
                <span key={role} className={`text-[10px] font-bold uppercase px-2 py-1 border rounded ${getRoleColor(role)}`}>{getRoleLabel(role)}</span>
              ))}
            </div>
          </div>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">Modifier</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-8">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Coordonnees</h3>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {tier.email && <div><dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Mail size={12} /> Email</dt><dd className="text-sm font-medium text-slate-900">{tier.email}</dd></div>}
              {tier.telephone && <div><dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Phone size={12} /> Telephone</dt><dd className="text-sm font-medium text-slate-900">{tier.telephone}</dd></div>}
              {tier.adresse && <div><dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin size={12} /> Adresse</dt><dd className="text-sm font-medium text-slate-900">{tier.adresse}, {tier.code_postal} {tier.ville}</dd></div>}
              {tier.siren && <div><dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1"><Hash size={12} /> SIREN</dt><dd className="text-sm font-medium text-slate-900 font-mono">{tier.siren}</dd></div>}
            </dl>
          </section>

          {ownedLots.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-8">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Lots possedes ({ownedLots.length})</h3>
              <div className="space-y-3">
                {ownedLots.map(lot => {
                  const bat = batiments.find(b => b.id === lot.batiment_id);
                  return (
                    <Link to={`/lots/${lot.id}`} key={lot.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"><FileText size={16} /></div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{lot.numero ? `Lot ${lot.numero}` : 'Lot'} — {lot.type_bien}</p>
                          {bat && <p className="text-xs text-slate-500">{bat.designation}</p>}
                        </div>
                      </div>
                      <span className="text-sm font-mono text-slate-400">{lot.surface ? `${lot.surface} m2` : ''}</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {managedLots.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-8">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Lots en gestion ({managedLots.length})</h3>
              <div className="space-y-3">
                {managedLots.map(lot => {
                  const bat = batiments.find(b => b.id === lot.batiment_id);
                  return (
                    <Link to={`/lots/${lot.id}`} key={lot.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100"><Building2 size={16} /></div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{lot.numero ? `Lot ${lot.numero}` : 'Lot'} — {lot.type_bien}</p>
                          {bat && <p className="text-xs text-slate-500">{bat.designation}</p>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        <div>
          <div className="bg-slate-900 rounded-xl p-6 text-white">
            <h4 className="text-slate-400 text-[10px] font-semibold uppercase tracking-widest mb-4">Resume</h4>
            <div className="space-y-6">
              <div><p className="text-3xl font-bold">{ownedLots.length}</p><p className="text-slate-400 text-xs">Lots possedes</p></div>
              <div className="h-px bg-slate-800" />
              <div><p className="text-3xl font-bold">{managedLots.length}</p><p className="text-slate-400 text-xs">Lots en gestion</p></div>
              <div className="h-px bg-slate-800" />
              <div><p className="text-3xl font-bold">{tier.roles.length}</p><p className="text-slate-400 text-xs">Roles</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
