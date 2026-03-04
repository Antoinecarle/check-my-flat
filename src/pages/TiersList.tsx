import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, User, Building2, Mail, Phone, MapPin, Filter, Users } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import type { TiersRole, TiersPersonType } from '../data/types';
import AdvancedFilter, { applyFilters, type FilterRule, type ColumnDef } from '../components/AdvancedFilter';
import DataTable, { type Column } from '../components/DataTable';
import Modal from '../components/Modal';
import TiersForm from '../components/forms/TiersForm';

const getRoleColor = (role: TiersRole) => {
  switch (role) {
    case 'proprietaire': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'mandataire': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'locataire': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  }
};

const getRoleLabel = (role: TiersRole) => {
  switch (role) {
    case 'proprietaire': return 'Proprietaire';
    case 'mandataire': return 'Mandataire';
    case 'locataire': return 'Locataire';
  }
};

const FILTER_COLUMNS: ColumnDef[] = [
  { key: 'nom', label: 'Nom', type: 'string', accessor: (t: any) => t.type_personne === 'morale' ? (t.raison_sociale || t.nom) : `${t.prenom || ''} ${t.nom}` },
  { key: 'type_personne', label: 'Type', type: 'string' },
  { key: 'email', label: 'Email', type: 'string' },
  { key: 'ville', label: 'Ville', type: 'string' },
];

export default function TiersList() {
  const { tiers } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<TiersRole | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TiersPersonType | 'all'>('all');
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredTiers = useMemo(() => {
    let result = tiers.filter((item) => {
      const matchesSearch =
        (item.nom?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.prenom?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.raison_sociale?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || item.roles.includes(roleFilter);
      const matchesType = typeFilter === 'all' || item.type_personne === typeFilter;
      return matchesSearch && matchesRole && matchesType && !item.archived;
    });
    result = applyFilters(result, filterRules, FILTER_COLUMNS);
    return result;
  }, [tiers, searchQuery, roleFilter, typeFilter, filterRules]);

  const tableColumns: Column<typeof filteredTiers[0]>[] = [
    {
      key: 'nom',
      label: 'Nom / Raison Sociale',
      minWidth: 200,
      render: (tier) => (
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 flex items-center justify-center border rounded-lg ${tier.type_personne === 'morale' ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-blue-50 border-blue-100 text-blue-400'}`}>
            {tier.type_personne === 'morale' ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <div>
            <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
              {tier.type_personne === 'morale' ? tier.raison_sociale || tier.nom : `${tier.prenom} ${tier.nom}`}
            </p>
            {tier.siren && <p className="text-[10px] font-mono text-slate-400 mt-0.5">SIREN: {tier.siren}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      minWidth: 80,
      render: (tier) => (
        <span className="text-[10px] font-bold uppercase py-1 px-2 border border-slate-200 text-slate-500 bg-white rounded">
          {tier.type_personne}
        </span>
      ),
    },
    {
      key: 'roles',
      label: 'Roles',
      minWidth: 140,
      render: (tier) => (
        <div className="flex flex-wrap gap-1.5">
          {tier.roles.map((role) => (
            <span key={role} className={`text-[9px] font-bold uppercase px-2 py-0.5 border rounded ${getRoleColor(role)}`}>
              {getRoleLabel(role)}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      minWidth: 160,
      render: (tier) => (
        <div className="flex flex-col gap-1">
          {tier.email && <div className="flex items-center gap-2 text-xs text-slate-600"><Mail className="w-3 h-3 text-slate-300" /><span className="truncate max-w-[160px]">{tier.email}</span></div>}
          {tier.telephone && <div className="flex items-center gap-2 text-xs text-slate-600"><Phone className="w-3 h-3 text-slate-300" /><span>{tier.telephone}</span></div>}
        </div>
      ),
    },
    {
      key: 'ville',
      label: 'Ville',
      minWidth: 100,
      render: (tier) => tier.ville ? (
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium"><MapPin className="w-3 h-3 text-slate-300" />{tier.ville}</div>
      ) : <span className="text-xs text-slate-400">—</span>,
    },
  ];

  return (
    <div>
      {/* Header */}
      <header className="pb-8 border-b border-slate-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-900">Tiers</h1>
            <p className="text-slate-500 text-sm mt-1">Proprietaires, mandataires et locataires</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all text-sm font-medium">
              <Plus className="w-4 h-4" /> Nouveau tiers
            </button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 bg-white p-4 border border-slate-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold uppercase text-slate-400">Roles</span>
          </div>
          {(['all', 'proprietaire', 'mandataire', 'locataire'] as const).map((role) => (
            <button key={role} onClick={() => setRoleFilter(role)} className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all border rounded-lg ${roleFilter === role ? 'bg-blue-600 border-blue-600 text-white' : 'bg-transparent border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-200'}`}>
              {role === 'all' ? 'Tous' : getRoleLabel(role as TiersRole) + 's'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase text-slate-400">Type</span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {([
              { key: 'all' as const, icon: Users, tip: 'Tous' },
              { key: 'physique' as const, icon: User, tip: 'Physique' },
              { key: 'morale' as const, icon: Building2, tip: 'Morale' },
            ]).map(({ key, icon: Icon, tip }) => (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                className={`p-2 rounded-md transition-all relative group/tip ${typeFilter === key ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                title={tip}
              >
                <Icon size={16} />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 pointer-events-none group-hover/tip:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 font-bold">
                  {tip}
                </div>
              </button>
            ))}
          </div>
          <AdvancedFilter columns={FILTER_COLUMNS} rules={filterRules} onChange={setFilterRules} />
        </div>
      </div>

      <DataTable
        columns={tableColumns}
        data={filteredTiers}
        onRowClick={(tier) => navigate(`/tiers/${tier.id}`)}
        emptyIcon={<Search className="w-8 h-8 text-slate-200" />}
        emptyMessage="Aucun tiers ne correspond a votre recherche."
      />

      <div className="mt-4 px-2">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Total: {filteredTiers.length} tiers</span>
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Nouveau tiers" size="lg">
        <TiersForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
}
