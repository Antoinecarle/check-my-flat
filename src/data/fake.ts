import type { Workspace, User, WorkspaceUser, Batiment, Lot, Tiers, Mission, Edl } from './types';

// ============================================================
// WORKSPACE
// ============================================================
export const workspace: Workspace = {
  id: 'ws-1',
  nom: 'FlatChecker SAS',
  type: 'societe_edl',
};

// ============================================================
// USERS
// ============================================================
export const users: User[] = [
  { id: 'u-1', email: 'clement@flatchecker.fr', prenom: 'Clément', nom: 'Durand' },
  { id: 'u-2', email: 'sophie@flatchecker.fr', prenom: 'Sophie', nom: 'Martin' },
  { id: 'u-3', email: 'lucas@flatchecker.fr', prenom: 'Lucas', nom: 'Bernard' },
  { id: 'u-4', email: 'julie@flatchecker.fr', prenom: 'Julie', nom: 'Petit' },
  { id: 'u-5', email: 'marc@externe.fr', prenom: 'Marc', nom: 'Lefevre' },
];

export const workspaceUsers: WorkspaceUser[] = [
  { user_id: 'u-1', workspace_id: 'ws-1', role: 'admin', is_externe: false },
  { user_id: 'u-2', workspace_id: 'ws-1', role: 'gestionnaire', is_externe: false },
  { user_id: 'u-3', workspace_id: 'ws-1', role: 'technicien', is_externe: false },
  { user_id: 'u-4', workspace_id: 'ws-1', role: 'technicien', is_externe: false },
  { user_id: 'u-5', workspace_id: 'ws-1', role: 'technicien', is_externe: true, tiers_id: 't-7' },
];

// ============================================================
// BATIMENTS
// ============================================================
export const batiments: Batiment[] = [
  {
    id: 'bat-1',
    workspace_id: 'ws-1',
    designation: 'Résidence Les Tilleuls',
    type: 'immeuble',
    annee_construction: 1985,
    numero_batiment: 'A',
    adresses: [
      { id: 'adr-1', type: 'principale', rue: '12 Rue des Tilleuls', code_postal: '78000', ville: 'Versailles' },
    ],
    lots_count: 8,
    created_at: '2025-11-15T10:00:00Z',
    archived: false,
  },
  {
    id: 'bat-2',
    workspace_id: 'ws-1',
    designation: 'Résidence Les Tilleuls',
    type: 'immeuble',
    annee_construction: 1985,
    numero_batiment: 'B',
    adresses: [
      { id: 'adr-2', type: 'principale', rue: '14 Rue des Tilleuls', code_postal: '78000', ville: 'Versailles' },
    ],
    lots_count: 6,
    created_at: '2025-11-15T10:00:00Z',
    archived: false,
  },
  {
    id: 'bat-3',
    workspace_id: 'ws-1',
    designation: 'Villa Beausoleil',
    type: 'maison',
    annee_construction: 2010,
    adresses: [
      { id: 'adr-3', type: 'principale', rue: '8 Avenue du Parc', code_postal: '92100', ville: 'Boulogne-Billancourt' },
    ],
    lots_count: 1,
    created_at: '2025-12-01T14:30:00Z',
    archived: false,
  },
  {
    id: 'bat-4',
    workspace_id: 'ws-1',
    designation: 'Immeuble Haussmann',
    type: 'immeuble',
    annee_construction: 1902,
    adresses: [
      { id: 'adr-4', type: 'principale', rue: '45 Boulevard Haussmann', code_postal: '75009', ville: 'Paris' },
      { id: 'adr-5', type: 'secondaire', rue: '3 Rue de Provence', code_postal: '75009', ville: 'Paris' },
    ],
    lots_count: 12,
    created_at: '2025-12-10T09:00:00Z',
    archived: false,
  },
  {
    id: 'bat-5',
    workspace_id: 'ws-1',
    designation: 'Centre Commercial Les Halles',
    type: 'local_commercial',
    annee_construction: 1995,
    adresses: [
      { id: 'adr-6', type: 'principale', rue: '22 Place du Marché', code_postal: '92200', ville: 'Neuilly-sur-Seine' },
    ],
    lots_count: 4,
    created_at: '2026-01-05T11:00:00Z',
    archived: false,
  },
  {
    id: 'bat-6',
    workspace_id: 'ws-1',
    designation: 'Résidence Le Clos Fleuri',
    type: 'immeuble',
    annee_construction: 1972,
    adresses: [
      { id: 'adr-7', type: 'principale', rue: '5 Allée des Roses', code_postal: '94200', ville: 'Ivry-sur-Seine' },
    ],
    lots_count: 10,
    created_at: '2026-01-20T08:00:00Z',
    archived: false,
  },
  {
    id: 'bat-7',
    workspace_id: 'ws-1',
    designation: 'Maison Dupont',
    type: 'maison',
    annee_construction: 1998,
    adresses: [
      { id: 'adr-8', type: 'principale', rue: '17 Rue du Château', code_postal: '78100', ville: 'Saint-Germain-en-Laye' },
    ],
    lots_count: 1,
    created_at: '2026-02-01T16:00:00Z',
    archived: true,
  },
];

// ============================================================
// LOTS
// ============================================================
export const lots: Lot[] = [
  { id: 'lot-1', batiment_id: 'bat-1', type_bien: 'appartement', etage: 'RDC', numero: '1', surface: 45, meuble: false, nb_pieces: 2, chauffage_type: 'collectif', chauffage_mode: 'gaz', eau_chaude_type: 'collectif', eau_chaude_mode: 'gaz', mandataire_id: 't-5', proprietaires: ['t-1'], created_at: '2025-11-15T10:00:00Z', archived: false },
  { id: 'lot-2', batiment_id: 'bat-1', type_bien: 'appartement', etage: '1er', numero: '2', surface: 62, meuble: true, nb_pieces: 3, chauffage_type: 'collectif', chauffage_mode: 'gaz', eau_chaude_type: 'collectif', eau_chaude_mode: 'gaz', mandataire_id: 't-5', proprietaires: ['t-1'], created_at: '2025-11-15T10:00:00Z', archived: false },
  { id: 'lot-3', batiment_id: 'bat-1', type_bien: 'appartement', etage: '2ème', numero: '3', surface: 78, meuble: false, nb_pieces: 4, chauffage_type: 'collectif', chauffage_mode: 'gaz', eau_chaude_type: 'collectif', eau_chaude_mode: 'gaz', proprietaires: ['t-2'], created_at: '2025-11-15T10:00:00Z', archived: false },
  { id: 'lot-4', batiment_id: 'bat-1', type_bien: 'appartement', etage: '3ème', numero: '4', surface: 55, meuble: false, nb_pieces: 2, chauffage_type: 'collectif', chauffage_mode: 'gaz', eau_chaude_type: 'collectif', eau_chaude_mode: 'gaz', proprietaires: ['t-3'], created_at: '2025-11-15T10:00:00Z', archived: false },
  { id: 'lot-5', batiment_id: 'bat-2', type_bien: 'appartement', etage: 'RDC', numero: '1', surface: 40, meuble: false, nb_pieces: 2, chauffage_type: 'collectif', chauffage_mode: 'gaz', eau_chaude_type: 'collectif', eau_chaude_mode: 'gaz', proprietaires: ['t-1'], created_at: '2025-11-15T10:00:00Z', archived: false },
  { id: 'lot-6', batiment_id: 'bat-3', type_bien: 'maison', surface: 145, meuble: false, nb_pieces: 6, chauffage_type: 'individuel', chauffage_mode: 'pompe_chaleur', eau_chaude_type: 'individuel', eau_chaude_mode: 'electrique', proprietaires: ['t-4'], created_at: '2025-12-01T14:30:00Z', archived: false },
  { id: 'lot-7', batiment_id: 'bat-4', type_bien: 'appartement', etage: '2ème', numero: '5', surface: 95, meuble: true, nb_pieces: 4, chauffage_type: 'individuel', chauffage_mode: 'gaz', eau_chaude_type: 'individuel', eau_chaude_mode: 'gaz', mandataire_id: 't-6', proprietaires: ['t-2', 't-3'], created_at: '2025-12-10T09:00:00Z', archived: false },
  { id: 'lot-8', batiment_id: 'bat-4', type_bien: 'appartement', etage: '5ème', numero: '10', surface: 120, meuble: false, nb_pieces: 5, chauffage_type: 'individuel', chauffage_mode: 'gaz', eau_chaude_type: 'individuel', eau_chaude_mode: 'gaz', mandataire_id: 't-6', proprietaires: ['t-4'], created_at: '2025-12-10T09:00:00Z', archived: false },
  { id: 'lot-9', batiment_id: 'bat-5', type_bien: 'local_commercial', etage: 'RDC', numero: 'B1', surface: 200, meuble: false, chauffage_type: 'individuel', chauffage_mode: 'electrique', eau_chaude_type: 'individuel', eau_chaude_mode: 'electrique', proprietaires: ['t-8'], created_at: '2026-01-05T11:00:00Z', archived: false },
  { id: 'lot-10', batiment_id: 'bat-5', type_bien: 'bureau', etage: '1er', numero: 'B2', surface: 85, meuble: true, chauffage_type: 'individuel', chauffage_mode: 'electrique', eau_chaude_type: 'individuel', eau_chaude_mode: 'electrique', proprietaires: ['t-8'], created_at: '2026-01-05T11:00:00Z', archived: false },
  { id: 'lot-11', batiment_id: 'bat-1', type_bien: 'box_parking', etage: 'SS1', numero: 'P1', surface: 15, meuble: false, proprietaires: ['t-1'], created_at: '2025-11-15T10:00:00Z', archived: false },
];

// ============================================================
// TIERS
// ============================================================
export const tiers: Tiers[] = [
  { id: 't-1', workspace_id: 'ws-1', type_personne: 'physique', nom: 'Moreau', prenom: 'Jean-Pierre', telephone: '06 12 34 56 78', email: 'jp.moreau@email.fr', adresse: '30 Rue Victor Hugo', code_postal: '78000', ville: 'Versailles', roles: ['proprietaire'], created_at: '2025-11-10T08:00:00Z', archived: false },
  { id: 't-2', workspace_id: 'ws-1', type_personne: 'physique', nom: 'Lambert', prenom: 'Marie', telephone: '06 98 76 54 32', email: 'marie.lambert@email.fr', adresse: '15 Rue de la Paix', code_postal: '75002', ville: 'Paris', roles: ['proprietaire'], created_at: '2025-11-10T08:00:00Z', archived: false },
  { id: 't-3', workspace_id: 'ws-1', type_personne: 'physique', nom: 'Dubois', prenom: 'Philippe', telephone: '06 55 44 33 22', email: 'p.dubois@email.fr', roles: ['proprietaire'], created_at: '2025-11-12T09:00:00Z', archived: false },
  { id: 't-4', workspace_id: 'ws-1', type_personne: 'morale', nom: 'SCI Beausoleil', raison_sociale: 'SCI Beausoleil', siren: '123456789', telephone: '01 45 67 89 00', email: 'contact@sci-beausoleil.fr', adresse: '8 Avenue du Parc', code_postal: '92100', ville: 'Boulogne-Billancourt', roles: ['proprietaire'], created_at: '2025-12-01T14:00:00Z', archived: false },
  { id: 't-5', workspace_id: 'ws-1', type_personne: 'morale', nom: 'Agence Versailles Immobilier', raison_sociale: 'Versailles Immobilier SARL', siren: '987654321', telephone: '01 39 50 12 34', email: 'contact@versailles-immo.fr', adresse: '5 Place du Marché', code_postal: '78000', ville: 'Versailles', roles: ['mandataire'], created_at: '2025-11-08T10:00:00Z', archived: false },
  { id: 't-6', workspace_id: 'ws-1', type_personne: 'morale', nom: 'Cabinet Haussmann Gestion', raison_sociale: 'Haussmann Gestion SAS', siren: '456789123', telephone: '01 42 65 78 90', email: 'gestion@haussmann.fr', adresse: '50 Boulevard Haussmann', code_postal: '75009', ville: 'Paris', roles: ['mandataire'], created_at: '2025-12-08T11:00:00Z', archived: false },
  { id: 't-7', workspace_id: 'ws-1', type_personne: 'morale', nom: 'EDL Express', raison_sociale: 'EDL Express SARL', siren: '789123456', telephone: '06 78 90 12 34', email: 'contact@edl-express.fr', roles: ['mandataire'], created_at: '2026-01-10T08:00:00Z', archived: false },
  { id: 't-8', workspace_id: 'ws-1', type_personne: 'morale', nom: 'Foncière Neuilly', raison_sociale: 'Foncière Neuilly SA', siren: '321654987', telephone: '01 46 37 89 00', email: 'contact@fonciere-neuilly.fr', adresse: '10 Avenue Charles de Gaulle', code_postal: '92200', ville: 'Neuilly-sur-Seine', roles: ['proprietaire'], created_at: '2026-01-04T10:00:00Z', archived: false },
  { id: 't-9', workspace_id: 'ws-1', type_personne: 'physique', nom: 'Garcia', prenom: 'Elena', telephone: '06 11 22 33 44', email: 'elena.garcia@email.fr', roles: ['locataire'], created_at: '2025-12-15T09:00:00Z', archived: false },
  { id: 't-10', workspace_id: 'ws-1', type_personne: 'physique', nom: 'Chen', prenom: 'Wei', telephone: '06 55 66 77 88', email: 'wei.chen@email.fr', roles: ['locataire'], created_at: '2026-01-20T10:00:00Z', archived: false },
  { id: 't-11', workspace_id: 'ws-1', type_personne: 'physique', nom: 'Petit', prenom: 'Camille', telephone: '06 99 88 77 66', email: 'camille.petit@email.fr', roles: ['locataire', 'proprietaire'], created_at: '2026-02-01T08:00:00Z', archived: false },
];

// ============================================================
// MISSIONS
// ============================================================
export const missions: Mission[] = [
  { id: 'm-1', workspace_id: 'ws-1', lot_id: 'lot-1', reference: 'M-2026-0001', date_planifiee: '2026-02-26', creneau: 'matin', statut: 'planifiee', techniciens: ['u-3'], edl_ids: ['edl-1'], created_by: 'u-2', created_at: '2026-02-20T09:00:00Z' },
  { id: 'm-2', workspace_id: 'ws-1', lot_id: 'lot-2', reference: 'M-2026-0002', date_planifiee: '2026-02-26', creneau: 'apres_midi', statut: 'planifiee', techniciens: ['u-3'], edl_ids: ['edl-2'], created_by: 'u-2', created_at: '2026-02-20T09:30:00Z' },
  { id: 'm-3', workspace_id: 'ws-1', lot_id: 'lot-7', reference: 'M-2026-0003', date_planifiee: '2026-02-27', creneau: 'matin', statut: 'planifiee', techniciens: ['u-4'], edl_ids: ['edl-3'], created_by: 'u-2', created_at: '2026-02-21T10:00:00Z' },
  { id: 'm-4', workspace_id: 'ws-1', lot_id: 'lot-6', reference: 'M-2026-0004', date_planifiee: '2026-02-27', creneau: 'apres_midi', statut: 'planifiee', techniciens: ['u-5'], edl_ids: ['edl-4'], created_by: 'u-1', created_at: '2026-02-21T11:00:00Z', commentaire: 'Grande maison, prévoir 2h minimum' },
  { id: 'm-5', workspace_id: 'ws-1', lot_id: 'lot-3', reference: 'M-2026-0005', date_planifiee: '2026-02-28', creneau: 'matin', statut: 'planifiee', techniciens: ['u-3'], edl_ids: ['edl-5'], created_by: 'u-2', created_at: '2026-02-22T08:00:00Z' },
  { id: 'm-6', workspace_id: 'ws-1', lot_id: 'lot-8', reference: 'M-2026-0006', date_planifiee: '2026-02-28', creneau: 'journee', statut: 'planifiee', techniciens: ['u-4'], edl_ids: ['edl-6', 'edl-7'], created_by: 'u-2', created_at: '2026-02-22T09:00:00Z', commentaire: 'EDL sortie + entrée le même jour' },
  { id: 'm-7', workspace_id: 'ws-1', lot_id: 'lot-5', reference: 'M-2026-0007', date_planifiee: '2026-03-01', creneau: 'matin', statut: 'planifiee', techniciens: ['u-3'], edl_ids: [], created_by: 'u-2', created_at: '2026-02-23T10:00:00Z' },
  { id: 'm-8', workspace_id: 'ws-1', lot_id: 'lot-9', reference: 'M-2026-0008', date_planifiee: '2026-03-03', creneau: 'custom', heure_debut: '14:00', heure_fin: '17:00', statut: 'planifiee', techniciens: ['u-5'], edl_ids: ['edl-8'], created_by: 'u-1', created_at: '2026-02-24T08:00:00Z', commentaire: 'Local commercial, accès par parking' },
  { id: 'm-9', workspace_id: 'ws-1', lot_id: 'lot-4', reference: 'M-2025-0042', date_planifiee: '2026-02-20', creneau: 'matin', statut: 'terminee', techniciens: ['u-4'], edl_ids: ['edl-9'], created_by: 'u-2', created_at: '2026-02-15T09:00:00Z' },
  { id: 'm-10', workspace_id: 'ws-1', lot_id: 'lot-2', reference: 'M-2025-0041', date_planifiee: '2026-02-18', creneau: 'apres_midi', statut: 'terminee', techniciens: ['u-3'], edl_ids: ['edl-10'], created_by: 'u-2', created_at: '2026-02-14T10:00:00Z' },
];

// ============================================================
// EDL
// ============================================================
export const edls: Edl[] = [
  { id: 'edl-1', workspace_id: 'ws-1', lot_id: 'lot-1', mission_id: 'm-1', type: 'sortie', statut: 'brouillon', technicien_id: 'u-3', locataires: ['t-9'], created_at: '2026-02-20T09:00:00Z' },
  { id: 'edl-2', workspace_id: 'ws-1', lot_id: 'lot-2', mission_id: 'm-2', type: 'entree', statut: 'brouillon', technicien_id: 'u-3', locataires: ['t-10'], created_at: '2026-02-20T09:30:00Z' },
  { id: 'edl-3', workspace_id: 'ws-1', lot_id: 'lot-7', mission_id: 'm-3', type: 'sortie', statut: 'brouillon', technicien_id: 'u-4', locataires: ['t-11'], created_at: '2026-02-21T10:00:00Z' },
  { id: 'edl-4', workspace_id: 'ws-1', lot_id: 'lot-6', mission_id: 'm-4', type: 'entree', statut: 'brouillon', technicien_id: 'u-5', locataires: ['t-9'], created_at: '2026-02-21T11:00:00Z' },
  { id: 'edl-5', workspace_id: 'ws-1', lot_id: 'lot-3', mission_id: 'm-5', type: 'sortie', statut: 'brouillon', technicien_id: 'u-3', locataires: ['t-10'], created_at: '2026-02-22T08:00:00Z' },
  { id: 'edl-6', workspace_id: 'ws-1', lot_id: 'lot-8', mission_id: 'm-6', type: 'sortie', statut: 'brouillon', technicien_id: 'u-4', locataires: ['t-11'], created_at: '2026-02-22T09:00:00Z' },
  { id: 'edl-7', workspace_id: 'ws-1', lot_id: 'lot-8', mission_id: 'm-6', type: 'entree', statut: 'brouillon', technicien_id: 'u-4', locataires: ['t-10'], created_at: '2026-02-22T09:00:00Z' },
  { id: 'edl-8', workspace_id: 'ws-1', lot_id: 'lot-9', mission_id: 'm-8', type: 'entree', statut: 'brouillon', technicien_id: 'u-5', locataires: [], created_at: '2026-02-24T08:00:00Z' },
  { id: 'edl-9', workspace_id: 'ws-1', lot_id: 'lot-4', mission_id: 'm-9', type: 'sortie', statut: 'signe', technicien_id: 'u-4', locataires: ['t-9'], date_realisation: '2026-02-20', created_at: '2026-02-15T09:00:00Z' },
  { id: 'edl-10', workspace_id: 'ws-1', lot_id: 'lot-2', mission_id: 'm-10', type: 'entree', statut: 'signe', technicien_id: 'u-3', locataires: ['t-10'], date_realisation: '2026-02-18', created_at: '2026-02-14T10:00:00Z' },
];

// ============================================================
// HELPERS
// ============================================================
export function getBatimentById(id: string) { return batiments.find(b => b.id === id); }
export function getLotById(id: string) { return lots.find(l => l.id === id); }
export function getTiersById(id: string) { return tiers.find(t => t.id === id); }
export function getUserById(id: string) { return users.find(u => u.id === id); }
export function getMissionById(id: string) { return missions.find(m => m.id === id); }
export function getLotsByBatiment(batimentId: string) { return lots.filter(l => l.batiment_id === batimentId); }
export function getMissionsByLot(lotId: string) { return missions.filter(m => m.lot_id === lotId); }
export function getEdlsByLot(lotId: string) { return edls.filter(e => e.lot_id === lotId); }
export function getEdlsByMission(missionId: string) { return edls.filter(e => e.mission_id === missionId); }
export function getTiersByRole(role: string) { return tiers.filter(t => t.roles.includes(role as any)); }
