import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Plus, MapPin } from 'lucide-react';
import type { MissionSlot } from '../../data/types';
import { useData } from '../../contexts/DataContext';
import { useRole } from '../../contexts/RoleContext';
import { users, workspaceUsers } from '../../data/fake';
import Modal from '../Modal';
import LotForm from './LotForm';
import BatimentForm from './BatimentForm';

interface MissionFormProps {
  onClose: () => void;
}

export default function MissionForm({ onClose }: MissionFormProps) {
  const { addMission, addEdl, lots, missions, getBatimentById } = useData();
  const { currentUserId } = useRole();

  const activeLots = useMemo(() => lots.filter(l => !l.archived).map(l => {
    const bat = getBatimentById(l.batiment_id);
    return {
      ...l,
      label: `${l.numero ? 'Lot ' + l.numero : 'Lot'} — ${l.type_bien}`,
      batimentName: bat?.designation || '',
      batimentAddr: bat?.adresses[0] ? `${bat.adresses[0].rue}, ${bat.adresses[0].code_postal} ${bat.adresses[0].ville}` : '',
      surface: l.surface,
    };
  }), [lots, getBatimentById]);

  const techniciens = useMemo(() =>
    workspaceUsers
      .filter(wu => wu.role === 'technicien')
      .map(wu => users.find(u => u.id === wu.user_id))
      .filter(Boolean) as typeof users,
  []);

  const [lotId, setLotId] = useState(activeLots[0]?.id || '');
  const [lotSearch, setLotSearch] = useState('');
  const [showLotDropdown, setShowLotDropdown] = useState(false);
  const [datePlanifiee, setDatePlanifiee] = useState('');
  const [creneau, setCreneau] = useState<MissionSlot>('matin');
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [commentaire, setCommentaire] = useState('');
  const [docEntree, setDocEntree] = useState(false);
  const [docSortie, setDocSortie] = useState(false);
  const [docInventaire, setDocInventaire] = useState(false);
  const [showLotModal, setShowLotModal] = useState(false);
  const [showBatimentModal, setShowBatimentModal] = useState(false);

  const lotDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (lotDropdownRef.current && !lotDropdownRef.current.contains(e.target as Node)) {
        setShowLotDropdown(false);
      }
    }
    if (showLotDropdown) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showLotDropdown]);

  const filteredLots = useMemo(() => {
    if (!lotSearch) return activeLots;
    const q = lotSearch.toLowerCase();
    return activeLots.filter(l =>
      l.label.toLowerCase().includes(q) ||
      l.batimentName.toLowerCase().includes(q) ||
      l.batimentAddr.toLowerCase().includes(q) ||
      (l.numero || '').toLowerCase().includes(q)
    );
  }, [activeLots, lotSearch]);

  const selectedLot = activeLots.find(l => l.id === lotId);

  const toggleTech = (userId: string) => {
    setSelectedTechs(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const year = new Date().getFullYear();
    const num = missions.length + 1;
    const reference = `M-${year}-${String(num).padStart(4, '0')}`;

    const edlIds: string[] = [];

    if (docEntree) {
      const eid = addEdl({ lot_id: lotId, type: 'entree', statut: 'brouillon', locataires: [] });
      edlIds.push(eid);
    }
    if (docSortie) {
      const eid = addEdl({ lot_id: lotId, type: 'sortie', statut: 'brouillon', locataires: [] });
      edlIds.push(eid);
    }
    if (docInventaire) {
      const eid = addEdl({ lot_id: lotId, type: 'inventaire', statut: 'brouillon', locataires: [] });
      edlIds.push(eid);
    }

    addMission({
      lot_id: lotId,
      reference,
      date_planifiee: datePlanifiee,
      creneau,
      heure_debut: creneau === 'custom' ? heureDebut : undefined,
      heure_fin: creneau === 'custom' ? heureFin : undefined,
      statut: selectedTechs.length === 0 ? 'a_assigner' : 'planifiee',
      commentaire: commentaire || undefined,
      techniciens: selectedTechs,
      edl_ids: edlIds,
      created_by: currentUserId,
    });
    onClose();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Lot selector with search */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lot *</label>
            <button type="button" onClick={() => setShowLotModal(true)} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <Plus size={12} /> Creer un lot
            </button>
          </div>
          <div className="relative" ref={lotDropdownRef}>
            <div
              onClick={() => setShowLotDropdown(!showLotDropdown)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm cursor-pointer bg-white hover:border-slate-300 transition-colors flex items-center justify-between"
            >
              <span className={selectedLot ? 'text-slate-900' : 'text-slate-400'}>
                {selectedLot ? `${selectedLot.label} — ${selectedLot.batimentName}` : 'Selectionner un lot'}
              </span>
              <Search size={14} className="text-slate-400" />
            </div>
            {showLotDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-64 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-slate-100">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Rechercher par lot, batiment, adresse..."
                      value={lotSearch}
                      onChange={e => setLotSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-blue-400"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="overflow-y-auto max-h-52">
                  {filteredLots.map(l => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => { setLotId(l.id); setShowLotDropdown(false); setLotSearch(''); }}
                      className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${l.id === lotId ? 'bg-blue-50/50' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{l.label}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin size={10} />{l.batimentName} — {l.batimentAddr}</p>
                        </div>
                        {l.surface && <span className="text-xs text-slate-400 font-mono">{l.surface} m2</span>}
                      </div>
                    </button>
                  ))}
                  {filteredLots.length === 0 && <p className="px-4 py-6 text-sm text-slate-400 text-center">Aucun lot trouve</p>}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Date planifiee *</label>
            <input type="date" required value={datePlanifiee} onChange={e => setDatePlanifiee(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Creneau *</label>
            <select required value={creneau} onChange={e => setCreneau(e.target.value as MissionSlot)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 bg-white">
              <option value="matin">Matin</option>
              <option value="apres_midi">Apres-midi</option>
              <option value="journee">Journee</option>
              <option value="custom">Horaire personnalise</option>
            </select>
          </div>
        </div>

        {creneau === 'custom' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Heure debut</label>
              <input type="time" value={heureDebut} onChange={e => setHeureDebut(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Heure fin</label>
              <input type="time" value={heureFin} onChange={e => setHeureFin(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600" />
            </div>
          </div>
        )}

        {/* Documents associes */}
        <div className="border-t border-slate-100 pt-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Documents associes</p>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={docEntree} onChange={e => setDocEntree(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20" />
              <span className="text-sm font-medium text-slate-700">EDL d'entree</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={docSortie} onChange={e => setDocSortie(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20" />
              <span className="text-sm font-medium text-slate-700">EDL de sortie</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={docInventaire} onChange={e => setDocInventaire(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20" />
              <span className="text-sm font-medium text-slate-700">Inventaire</span>
            </label>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Techniciens</label>
          <div className="space-y-2">
            {techniciens.map(tech => (
              <label key={tech.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                <input type="checkbox" checked={selectedTechs.includes(tech.id)} onChange={() => toggleTech(tech.id)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600/20" />
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">{tech.prenom[0]}{tech.nom[0]}</div>
                <span className="text-sm font-medium text-slate-700">{tech.prenom} {tech.nom}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Commentaire</label>
          <textarea value={commentaire} onChange={e => setCommentaire(e.target.value)} placeholder="Instructions ou notes..." rows={3} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 resize-none" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Annuler</button>
          <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">Creer la mission</button>
        </div>
      </form>

      {/* Nested Lot creation modal */}
      <Modal isOpen={showLotModal} onClose={() => setShowLotModal(false)} title="Nouveau lot" size="lg">
        <LotForm
          onClose={() => setShowLotModal(false)}
          onOpenBatimentModal={() => { setShowLotModal(false); setShowBatimentModal(true); }}
        />
      </Modal>

      {/* Nested Batiment creation modal */}
      <Modal isOpen={showBatimentModal} onClose={() => setShowBatimentModal(false)} title="Nouveau batiment">
        <BatimentForm onClose={() => { setShowBatimentModal(false); setShowLotModal(true); }} />
      </Modal>
    </>
  );
}
