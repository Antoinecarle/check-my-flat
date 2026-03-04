import { useState, useRef, useEffect } from 'react';
import { Filter, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterRule {
  id: string;
  column: string;
  operator: FilterOperator;
  value: string;
}

export type FilterOperator = 'contains' | 'equals' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'not_equals';

export interface ColumnDef {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date';
  accessor?: (item: any) => string | number | undefined;
}

const OPERATOR_LABELS: Record<FilterOperator, string> = {
  contains: 'Contient',
  equals: 'Egal a',
  starts_with: 'Commence par',
  ends_with: 'Finit par',
  greater_than: 'Superieur a',
  less_than: 'Inferieur a',
  not_equals: 'Different de',
};

const OPERATORS_BY_TYPE: Record<string, FilterOperator[]> = {
  string: ['contains', 'equals', 'starts_with', 'ends_with', 'not_equals'],
  number: ['equals', 'greater_than', 'less_than', 'not_equals'],
  date: ['equals', 'greater_than', 'less_than'],
};

interface AdvancedFilterProps {
  columns: ColumnDef[];
  rules: FilterRule[];
  onChange: (rules: FilterRule[]) => void;
}

export default function AdvancedFilter({ columns, rules, onChange }: AdvancedFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newColumn, setNewColumn] = useState(columns[0]?.key || '');
  const [newOperator, setNewOperator] = useState<FilterOperator>('contains');
  const [newValue, setNewValue] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  const selectedColumnDef = columns.find(c => c.key === newColumn);
  const availableOperators = OPERATORS_BY_TYPE[selectedColumnDef?.type || 'string'];

  useEffect(() => {
    if (selectedColumnDef && !availableOperators.includes(newOperator)) {
      setNewOperator(availableOperators[0]);
    }
  }, [newColumn]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const addRule = () => {
    if (!newValue.trim()) return;
    onChange([...rules, { id: `f-${Date.now()}`, column: newColumn, operator: newOperator, value: newValue.trim() }]);
    setNewValue('');
  };

  const removeRule = (id: string) => {
    onChange(rules.filter(r => r.id !== id));
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider border rounded-lg transition-all ${
          rules.length > 0
            ? 'bg-blue-50 border-blue-200 text-blue-700'
            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
        }`}
      >
        <Filter size={14} />
        Filtres
        {rules.length > 0 && (
          <span className="w-5 h-5 flex items-center justify-center bg-blue-600 text-white rounded-full text-[10px] font-bold">
            {rules.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-3 top-auto bottom-3 sm:absolute sm:inset-auto sm:top-full sm:left-0 sm:bottom-auto sm:mt-2 sm:w-[480px] bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4"
          >
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Ajouter un filtre</div>
            <div className="flex items-end gap-2 mb-4">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Colonne</label>
                <select
                  value={newColumn}
                  onChange={e => setNewColumn(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600"
                >
                  {columns.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              <div className="w-36">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Operateur</label>
                <select
                  value={newOperator}
                  onChange={e => setNewOperator(e.target.value as FilterOperator)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600"
                >
                  {availableOperators.map(op => <option key={op} value={op}>{OPERATOR_LABELS[op]}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Valeur</label>
                <input
                  type={selectedColumnDef?.type === 'number' ? 'number' : 'text'}
                  value={newValue}
                  onChange={e => setNewValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addRule()}
                  placeholder="..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600"
                />
              </div>
              <button
                onClick={addRule}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
              >
                <Plus size={16} />
              </button>
            </div>

            {rules.length > 0 && (
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Filtres actifs</div>
                {rules.map(rule => {
                  const col = columns.find(c => c.key === rule.column);
                  return (
                    <div key={rule.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-xs font-bold text-slate-700">{col?.label || rule.column}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{OPERATOR_LABELS[rule.operator]}</span>
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{rule.value}</span>
                      <button onClick={() => removeRule(rule.id)} className="ml-auto p-1 text-slate-300 hover:text-red-500 transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
                <button
                  onClick={() => onChange([])}
                  className="text-[10px] font-bold uppercase text-red-500 hover:underline mt-1"
                >
                  Tout effacer
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filter chips below */}
      {rules.length > 0 && !isOpen && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {rules.map(rule => {
            const col = columns.find(c => c.key === rule.column);
            return (
              <span key={rule.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full text-[11px] font-medium text-blue-700">
                {col?.label}: {rule.value}
                <button onClick={() => removeRule(rule.id)} className="hover:text-red-500 transition-colors">
                  <X size={10} />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function applyFilters<T>(items: T[], rules: FilterRule[], columns: ColumnDef[]): T[] {
  if (rules.length === 0) return items;
  return items.filter(item => {
    return rules.every(rule => {
      const colDef = columns.find(c => c.key === rule.column);
      if (!colDef) return true;
      const rawVal = colDef.accessor ? colDef.accessor(item) : (item as any)[rule.column];
      if (rawVal === undefined || rawVal === null) return false;

      const val = String(rawVal).toLowerCase();
      const ruleVal = rule.value.toLowerCase();

      switch (rule.operator) {
        case 'contains': return val.includes(ruleVal);
        case 'equals': return val === ruleVal;
        case 'starts_with': return val.startsWith(ruleVal);
        case 'ends_with': return val.endsWith(ruleVal);
        case 'not_equals': return val !== ruleVal;
        case 'greater_than': return Number(rawVal) > Number(rule.value);
        case 'less_than': return Number(rawVal) < Number(rule.value);
        default: return true;
      }
    });
  });
}
