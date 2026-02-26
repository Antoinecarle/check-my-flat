import { useState, useMemo } from 'react';
import type { MissionSlot } from '../../data/types';
import { useData } from '../../contexts/DataContext';
import { useRole } from '../../contexts/RoleContext';
import { users, workspaceUsers } from '../../data/fake';

interface MissionFormProps {
  onClose: () => void;
}

export default function MissionForm({ onClose }: MissionFormProps) {
  const { addMission, lots, missions, getBatimentById } = useData();
  const { currentUserId } = useRole();

  const activeLots = useMemo(() => lots.filter(l => !l.archived).map(l => {
    const bat = getBatimentById(l.batiment_id);
    return { ...l, label: `${l.numero ? 'Lot ' + l.numero : 'Lot'} — ${bat?.designation || ''}` };
  }), [lots, getBatimentById]);

  const techniciens = useMemo(() =>
    workspaceUsers
      .filter(wu => wu.role === 'technicien')
      .map(wu => users.find(u => u.id === wu.user_id))
      .filter(Boolean) as typeof users,
  []);

  const [lotId, setLotId] = useState(activeLots[0]?.id || '');
  const [datePlanifiee, setDatePlanifiee] = useState('');
  const [creneau, setCreneau] = useState<MissionSlot>('matin');
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [commentaire, setCommentaire] = useState('');

  const toggleTech = (userId: string) => {
    setSelectedTechs(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const year = new Date().getFullYear();
    const num = missions.length + 1;
    const reference = `M-${year}-${String(num).padStart(4, '0')}`;

    addMission({
      lot_id: lotId,
      reference,
      date_planifiee: datePlanifiee,
      creneau,
      heure_debut: creneau === 'custom' ? heureDebut : undefined,
      heure_fin: creneau === 'custom' ? heureFin : undefined,
      statut: 'planifiee',
      commentaire: commentaire || undefined,
      techniciens: selectedTechs,
      edl_ids: [],
      created_by: currentUserId,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Lot *</label>
        <select required value={lotId} onChange={e => setLotId(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 bg-white">
          {activeLots.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
        <div className="grid grid-cols-2 gap-4">
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
  );
}
