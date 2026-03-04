import { useState } from 'react';
import type { TiersPersonType, TiersRole } from '../../data/types';
import { useData } from '../../contexts/DataContext';

interface TiersFormProps {
  onClose: () => void;
}

export default function TiersForm({ onClose }: TiersFormProps) {
  const { addTiers } = useData();
  const [typePersn, setTypePersn] = useState<TiersPersonType>('physique');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [raisonSociale, setRaisonSociale] = useState('');
  const [siren, setSiren] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [ville, setVille] = useState('');
  const [roles, setRoles] = useState<TiersRole[]>([]);

  const toggleRole = (role: TiersRole) => {
    setRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTiers({
      type_personne: typePersn,
      nom: typePersn === 'morale' ? (raisonSociale || nom) : nom,
      prenom: typePersn === 'physique' ? prenom : undefined,
      raison_sociale: typePersn === 'morale' ? raisonSociale : undefined,
      siren: typePersn === 'morale' ? (siren || undefined) : undefined,
      email: email || undefined,
      telephone: telephone || undefined,
      adresse: adresse || undefined,
      code_postal: codePostal || undefined,
      ville: ville || undefined,
      roles,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type toggle */}
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Type de tiers</label>
        <div className="flex p-1 bg-slate-100 rounded-lg w-fit">
          {(['physique', 'morale'] as TiersPersonType[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTypePersn(t)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-all ${typePersn === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              {t === 'physique' ? 'Physique' : 'Morale'}
            </button>
          ))}
        </div>
      </div>

      {/* Fields based on type */}
      {typePersn === 'physique' ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Nom *</label>
            <input type="text" required value={nom} onChange={e => setNom(e.target.value)} placeholder="Dupont" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Prenom *</label>
            <input type="text" required value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Jean" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
          </div>
        </div>
      ) : (
        <>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Raison sociale *</label>
            <input type="text" required value={raisonSociale} onChange={e => setRaisonSociale(e.target.value)} placeholder="SCI Exemple" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">SIREN</label>
            <input type="text" value={siren} onChange={e => setSiren(e.target.value)} placeholder="123456789" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemple.fr" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Telephone</label>
          <input type="text" value={telephone} onChange={e => setTelephone(e.target.value)} placeholder="06 12 34 56 78" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Adresse</label>
        <input type="text" value={adresse} onChange={e => setAdresse(e.target.value)} placeholder="12 Rue Exemple" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Code postal</label>
          <input type="text" value={codePostal} onChange={e => setCodePostal(e.target.value)} placeholder="75000" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Ville</label>
          <input type="text" value={ville} onChange={e => setVille(e.target.value)} placeholder="Paris" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
        </div>
      </div>

      {/* Roles */}
      <div className="border-t border-slate-100 pt-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Roles</p>
        <div className="flex flex-wrap gap-4">
          {(['proprietaire', 'mandataire', 'locataire'] as TiersRole[]).map(role => (
            <label key={role} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={roles.includes(role)} onChange={() => toggleRole(role)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20" />
              <span className="text-sm font-medium text-slate-700 capitalize">{role}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Annuler</button>
        <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Creer le tiers</button>
      </div>
    </form>
  );
}
