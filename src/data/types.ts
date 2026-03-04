// ============================================================
// ImmoChecker — Types & Interfaces
// ============================================================

export type WorkspaceType = 'societe_edl' | 'bailleur' | 'agence';
export type UserRole = 'admin' | 'gestionnaire' | 'technicien';

export type BuildingType = 'immeuble' | 'maison' | 'local_commercial' | 'mixte';
export type LotType = 'appartement' | 'maison' | 'box_parking' | 'bureau' | 'local_commercial' | 'autre';
export type HeatingType = 'individuel' | 'collectif' | 'aucun';
export type HeatingMode = 'gaz' | 'electrique' | 'fioul' | 'pompe_chaleur' | 'autre';

export type TiersPersonType = 'physique' | 'morale';
export type TiersRole = 'proprietaire' | 'mandataire' | 'locataire';

export type MissionStatus = 'planifiee' | 'a_assigner' | 'en_cours' | 'terminee' | 'annulee';
export type MissionSlot = 'matin' | 'apres_midi' | 'journee' | 'custom';

export type EdlType = 'entree' | 'sortie' | 'inventaire';
export type EdlStatus = 'brouillon' | 'en_cours' | 'signe' | 'archive';

// ============================================================

export interface Workspace {
  id: string;
  nom: string;
  type: WorkspaceType;
  logo?: string;
}

export interface User {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  avatar?: string;
}

export interface WorkspaceUser {
  user_id: string;
  workspace_id: string;
  role: UserRole;
  is_externe: boolean;
  tiers_id?: string;
}

export interface Adresse {
  id: string;
  type: 'principale' | 'secondaire';
  rue: string;
  complement?: string;
  code_postal: string;
  ville: string;
}

export interface Batiment {
  id: string;
  workspace_id: string;
  designation: string;
  type: BuildingType;
  annee_construction?: number;
  numero_batiment?: string;
  adresses: Adresse[];
  lots_count: number;
  created_at: string;
  archived: boolean;
}

export interface Lot {
  id: string;
  batiment_id: string;
  type_bien: LotType;
  etage?: string;
  numero?: string;
  surface?: number;
  meuble: boolean;
  nb_pieces?: number;
  chauffage_type?: HeatingType;
  chauffage_mode?: HeatingMode;
  eau_chaude_type?: HeatingType;
  eau_chaude_mode?: HeatingMode;
  mandataire_id?: string;
  proprietaires: string[]; // tiers_ids
  created_at: string;
  archived: boolean;
}

export interface Tiers {
  id: string;
  workspace_id: string;
  type_personne: TiersPersonType;
  nom: string;
  prenom?: string;
  raison_sociale?: string;
  siren?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  telephone?: string;
  email?: string;
  roles: TiersRole[];
  organisations?: string[]; // tiers_ids of orgs
  created_at: string;
  archived: boolean;
}

export interface Mission {
  id: string;
  workspace_id: string;
  lot_id: string;
  reference: string;
  date_planifiee: string;
  creneau: MissionSlot;
  heure_debut?: string;
  heure_fin?: string;
  statut: MissionStatus;
  commentaire?: string;
  techniciens: string[]; // user_ids
  edl_ids: string[];
  created_by: string;
  created_at: string;
}

export interface Edl {
  id: string;
  workspace_id: string;
  lot_id: string;
  mission_id?: string;
  type: EdlType;
  statut: EdlStatus;
  technicien_id?: string;
  locataires: string[]; // tiers_ids
  date_realisation?: string;
  created_at: string;
}
