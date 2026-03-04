import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { LotType, HeatingType, HeatingMode } from '../../data/types';
import { useData } from '../../contexts/DataContext';

interface LotFormProps {
  onClose: () => void;
  preselectedBatimentId?: string;
  onOpenBatimentModal?: () => void;
}

export default function LotForm({ onClose, preselectedBatimentId, onOpenBatimentModal }: LotFormProps) {
  const { addLot, batiments } = useData();
  const activeBatiments = batiments.filter(b => !b.archived);

  const [batimentId, setBatimentId] = useState(preselectedBatimentId || activeBatiments[0]?.id || '');
  const [typeBien, setTypeBien] = useState<LotType>('appartement');
  const [etage, setEtage] = useState('');
  const [numero, setNumero] = useState('');
  const [surface, setSurface] = useState('');
  const [nbPieces, setNbPieces] = useState('');
  const [meuble, setMeuble] = useState(false);
  const [chauffageType, setChauffageType] = useState<HeatingType>('individuel');
  const [chauffageMode, setChauffageMode] = useState<HeatingMode>('gaz');
  const [eauType, setEauType] = useState<HeatingType>('individuel');
  const [eauMode, setEauMode] = useState<HeatingMode>('electrique');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLot({
      batiment_id: batimentId,
      type_bien: typeBien,
      etage: etage || undefined,
      numero: numero || undefined,
      surface: surface ? Number(surface) : undefined,
      nb_pieces: nbPieces ? Number(nbPieces) : undefined,
      meuble,
      chauffage_type: chauffageType,
      chauffage_mode: chauffageMode,
      eau_chaude_type: eauType,
      eau_chaude_mode: eauMode,
      proprietaires: [],
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Batiment *</label>
          {onOpenBatimentModal && (
            <button type="button" onClick={onOpenBatimentModal} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <Plus size={12} /> Creer un batiment
            </button>
          )}
        </div>
        <select required value={batimentId} onChange={e => setBatimentId(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 bg-white">
          {activeBatiments.map(b => <option key={b.id} value={b.id}>{b.designation}{b.numero_batiment ? ` (Bat. ${b.numero_batiment})` : ''}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Type de bien *</label>
          <select required value={typeBien} onChange={e => setTypeBien(e.target.value as LotType)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 bg-white">
            <option value="appartement">Appartement</option>
            <option value="maison">Maison</option>
            <option value="box_parking">Box Parking</option>
            <option value="bureau">Bureau</option>
            <option value="local_commercial">Local Commercial</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Etage</label>
          <input type="text" value={etage} onChange={e => setEtage(e.target.value)} placeholder="RDC, 1er, 2eme..." className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Numero</label>
          <input type="text" value={numero} onChange={e => setNumero(e.target.value)} placeholder="1, 2, A..." className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Surface (m2)</label>
          <input type="number" value={surface} onChange={e => setSurface(e.target.value)} placeholder="45" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Pieces</label>
          <input type="number" value={nbPieces} onChange={e => setNbPieces(e.target.value)} placeholder="3" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={meuble} onChange={e => setMeuble(e.target.checked)} />
          <div className="w-10 h-5 bg-slate-200 rounded-full peer-checked:bg-blue-600 transition-colors" />
          <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
        </label>
        <span className="text-sm font-medium text-slate-600">Meuble</span>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Informations techniques</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Chauffage type</label>
            <select value={chauffageType} onChange={e => setChauffageType(e.target.value as HeatingType)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600">
              <option value="individuel">Individuel</option>
              <option value="collectif">Collectif</option>
              <option value="aucun">Aucun</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Chauffage mode</label>
            <select value={chauffageMode} onChange={e => setChauffageMode(e.target.value as HeatingMode)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600">
              <option value="gaz">Gaz</option>
              <option value="electrique">Electrique</option>
              <option value="fioul">Fioul</option>
              <option value="pompe_chaleur">Pompe a chaleur</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Eau chaude type</label>
            <select value={eauType} onChange={e => setEauType(e.target.value as HeatingType)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600">
              <option value="individuel">Individuel</option>
              <option value="collectif">Collectif</option>
              <option value="aucun">Aucun</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Eau chaude mode</label>
            <select value={eauMode} onChange={e => setEauMode(e.target.value as HeatingMode)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600">
              <option value="gaz">Gaz</option>
              <option value="electrique">Electrique</option>
              <option value="fioul">Fioul</option>
              <option value="pompe_chaleur">Pompe a chaleur</option>
              <option value="autre">Autre</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Annuler</button>
        <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Creer le lot</button>
      </div>
    </form>
  );
}
