import { useState } from 'react';
import type { BuildingType } from '../../data/types';
import { useData } from '../../contexts/DataContext';

interface BatimentFormProps {
  onClose: () => void;
}

export default function BatimentForm({ onClose }: BatimentFormProps) {
  const { addBatiment } = useData();
  const [designation, setDesignation] = useState('');
  const [type, setType] = useState<BuildingType>('immeuble');
  const [annee, setAnnee] = useState('');
  const [numero, setNumero] = useState('');
  const [rue, setRue] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [ville, setVille] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBatiment({
      designation,
      type,
      annee_construction: annee ? Number(annee) : undefined,
      numero_batiment: numero || undefined,
      adresses: [{
        id: `adr-${Date.now()}`,
        type: 'principale',
        rue,
        code_postal: codePostal,
        ville,
      }],
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Designation *</label>
        <input type="text" required value={designation} onChange={e => setDesignation(e.target.value)} placeholder="ex: Residence Les Tilleuls" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Type *</label>
          <select required value={type} onChange={e => setType(e.target.value as BuildingType)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 bg-white">
            <option value="immeuble">Immeuble</option>
            <option value="maison">Maison</option>
            <option value="local_commercial">Local Commercial</option>
            <option value="mixte">Mixte</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Annee de construction</label>
          <input type="number" value={annee} onChange={e => setAnnee(e.target.value)} placeholder="ex: 1985" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Numero du batiment</label>
        <input type="text" value={numero} onChange={e => setNumero(e.target.value)} placeholder="ex: A, B, C..." className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
      </div>
      <div className="border-t border-slate-100 pt-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Adresse principale</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Rue *</label>
            <input type="text" required value={rue} onChange={e => setRue(e.target.value)} placeholder="ex: 12 Rue des Tilleuls" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Code postal *</label>
              <input type="text" required value={codePostal} onChange={e => setCodePostal(e.target.value)} placeholder="78000" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Ville *</label>
              <input type="text" required value={ville} onChange={e => setVille(e.target.value)} placeholder="Versailles" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Annuler</button>
        <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Creer le batiment</button>
      </div>
    </form>
  );
}
