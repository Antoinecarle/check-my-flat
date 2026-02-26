import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  batiments as initialBatiments,
  lots as initialLots,
  missions as initialMissions,
  edls as initialEdls,
  tiers as initialTiers,
  users,
  workspaceUsers,
  workspace,
} from '../data/fake';
import type { Batiment, Lot, Mission, Edl, Tiers } from '../data/types';

interface DataContextValue {
  batiments: Batiment[];
  lots: Lot[];
  missions: Mission[];
  edls: Edl[];
  tiers: Tiers[];
  addBatiment: (b: Omit<Batiment, 'id' | 'workspace_id' | 'created_at' | 'archived' | 'lots_count'>) => void;
  addLot: (l: Omit<Lot, 'id' | 'created_at' | 'archived'>) => void;
  addMission: (m: Omit<Mission, 'id' | 'workspace_id' | 'created_at'>) => void;
  updateMission: (id: string, updates: Partial<Mission>) => void;
  getBatimentById: (id: string) => Batiment | undefined;
  getLotById: (id: string) => Lot | undefined;
  getTiersById: (id: string) => Tiers | undefined;
  getUserById: (id: string) => typeof users[0] | undefined;
  getMissionById: (id: string) => Mission | undefined;
  getLotsByBatiment: (batimentId: string) => Lot[];
  getMissionsByLot: (lotId: string) => Mission[];
  getEdlsByLot: (lotId: string) => Edl[];
  getEdlsByMission: (missionId: string) => Edl[];
  getTiersByRole: (role: string) => Tiers[];
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [batiments, setBatiments] = useState<Batiment[]>([...initialBatiments]);
  const [lots, setLots] = useState<Lot[]>([...initialLots]);
  const [missions, setMissions] = useState<Mission[]>([...initialMissions]);
  const [edls, setEdls] = useState<Edl[]>([...initialEdls]);
  const [tiersList] = useState<Tiers[]>([...initialTiers]);

  const addBatiment = useCallback((b: Omit<Batiment, 'id' | 'workspace_id' | 'created_at' | 'archived' | 'lots_count'>) => {
    const id = `bat-${Date.now()}`;
    setBatiments(prev => [...prev, {
      ...b,
      id,
      workspace_id: 'ws-1',
      lots_count: 0,
      created_at: new Date().toISOString(),
      archived: false,
    }]);
  }, []);

  const addLot = useCallback((l: Omit<Lot, 'id' | 'created_at' | 'archived'>) => {
    const id = `lot-${Date.now()}`;
    setLots(prev => [...prev, {
      ...l,
      id,
      created_at: new Date().toISOString(),
      archived: false,
    }]);
    setBatiments(prev => prev.map(b =>
      b.id === l.batiment_id ? { ...b, lots_count: b.lots_count + 1 } : b
    ));
  }, []);

  const addMission = useCallback((m: Omit<Mission, 'id' | 'workspace_id' | 'created_at'>) => {
    const id = `m-${Date.now()}`;
    setMissions(prev => [...prev, {
      ...m,
      id,
      workspace_id: 'ws-1',
      created_at: new Date().toISOString(),
    }]);
  }, []);

  const updateMission = useCallback((id: string, updates: Partial<Mission>) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const getBatimentById = useCallback((id: string) => batiments.find(b => b.id === id), [batiments]);
  const getLotById = useCallback((id: string) => lots.find(l => l.id === id), [lots]);
  const getTiersById = useCallback((id: string) => tiersList.find(t => t.id === id), [tiersList]);
  const getUserById = useCallback((id: string) => users.find(u => u.id === id), []);
  const getMissionById = useCallback((id: string) => missions.find(m => m.id === id), [missions]);
  const getLotsByBatiment = useCallback((batimentId: string) => lots.filter(l => l.batiment_id === batimentId), [lots]);
  const getMissionsByLot = useCallback((lotId: string) => missions.filter(m => m.lot_id === lotId), [missions]);
  const getEdlsByLot = useCallback((lotId: string) => edls.filter(e => e.lot_id === lotId), [edls]);
  const getEdlsByMission = useCallback((missionId: string) => edls.filter(e => e.mission_id === missionId), [edls]);
  const getTiersByRole = useCallback((role: string) => tiersList.filter(t => t.roles.includes(role as any)), [tiersList]);

  return (
    <DataContext.Provider value={{
      batiments, lots, missions, edls, tiers: tiersList,
      addBatiment, addLot, addMission, updateMission,
      getBatimentById, getLotById, getTiersById, getUserById, getMissionById,
      getLotsByBatiment, getMissionsByLot, getEdlsByLot, getEdlsByMission, getTiersByRole,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
