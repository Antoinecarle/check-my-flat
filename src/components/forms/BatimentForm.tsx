import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { BuildingType, Adresse } from '../../data/types';
import { useData } from '../../contexts/DataContext';

interface BatimentFormProps {
  onClose: () => void;
}

interface AddressRow {
  id: string;
  type: 'principale' | 'secondaire';
  rue: string;
  code_postal: string;
  ville: string;
}

export default function BatimentForm({ onClose }: BatimentFormProps) {
  const { addBatiment } = useData();
  const [designation, setDesignation] = useState('');
  const [type, setType] = useState<BuildingType>('immeuble');
  const [annee, setAnnee] = useState('');
  const [numero, setNumero] = useState('');
  const [addresses, setAddresses] = useState<AddressRow[]>([
    { id: `adr-${Date.now()}`, type: 'principale', rue: '', code_postal: '', ville: '' },
  ]);

  const addAddress = () => {
    setAddresses(prev => [...prev, {
      id: `adr-${Date.now()}-${prev.length}`,
      type: 'secondaire',
      rue: '',
      code_postal: '',
      ville: '',
    }]);
  };

  const removeAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const updateAddress = (id: string, field: keyof AddressRow, value: string) => {
    setAddresses(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBatiment({
      designation,
      type,
      annee_construction: annee ? Number(annee) : undefined,
      numero_batiment: numero || undefined,
      adresses: addresses.map(a => ({
        id: a.id,
        type: a.type,
        rue: a.rue,
        code_postal: a.code_postal,
        ville: a.ville,
      })) as Adresse[],
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Designation *</label>
        <input type="text" required value={designation} onChange={e => setDesignation(e.target.value)} placeholder="ex: Residence Les Tilleuls" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* Addresses */}
      <div className="border-t border-slate-100 pt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Adresses</p>
          <button type="button" onClick={addAddress} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <Plus size={12} /> Ajouter une adresse
          </button>
        </div>
        <div className="space-y-4">
          {addresses.map((addr, idx) => (
            <div key={addr.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {addr.type === 'principale' ? 'Adresse principale' : `Adresse secondaire ${idx}`}
                </span>
                {addr.type !== 'principale' && (
                  <button type="button" onClick={() => removeAddress(addr.id)} className="p-1 text-slate-400 hover:text-rose-500 transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Rue *</label>
                  <input type="text" required value={addr.rue} onChange={e => updateAddress(addr.id, 'rue', e.target.value)} placeholder="12 Rue des Tilleuls" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 bg-white" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Code postal *</label>
                    <input type="text" required value={addr.code_postal} onChange={e => updateAddress(addr.id, 'code_postal', e.target.value)} placeholder="78000" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 bg-white" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Ville *</label>
                    <input type="text" required value={addr.ville} onChange={e => updateAddress(addr.id, 'ville', e.target.value)} placeholder="Versailles" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 bg-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Annuler</button>
        <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Creer le batiment</button>
      </div>
    </form>
  );
}
