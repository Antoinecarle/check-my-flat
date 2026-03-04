import { useState, useCallback, useRef, type ReactNode } from 'react';
import { GripVertical } from 'lucide-react';

export interface Column<T> {
  key: string;
  label: string;
  render: (item: T) => ReactNode;
  width?: number;
  minWidth?: number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyIcon?: ReactNode;
  emptyMessage?: string;
}

export default function DataTable<T>({ columns, data, onRowClick, emptyIcon, emptyMessage = 'Aucun resultat' }: DataTableProps<T>) {
  const [columnOrder, setColumnOrder] = useState<string[]>(columns.map(c => c.key));
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const w: Record<string, number> = {};
    columns.forEach(c => { w[c.key] = c.width || 0; });
    return w;
  });
  const [draggedCol, setDraggedCol] = useState<string | null>(null);
  const resizingRef = useRef<{ key: string; startX: number; startWidth: number } | null>(null);

  const orderedColumns = columnOrder
    .map(key => columns.find(c => c.key === key))
    .filter(Boolean) as Column<T>[];

  const handleDragStart = useCallback((key: string) => {
    setDraggedCol(key);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, targetKey: string) => {
    e.preventDefault();
    if (!draggedCol || draggedCol === targetKey) return;
    setColumnOrder(prev => {
      const newOrder = [...prev];
      const fromIdx = newOrder.indexOf(draggedCol);
      const toIdx = newOrder.indexOf(targetKey);
      if (fromIdx === -1 || toIdx === -1) return prev;
      newOrder.splice(fromIdx, 1);
      newOrder.splice(toIdx, 0, draggedCol);
      return newOrder;
    });
  }, [draggedCol]);

  const handleDragEnd = useCallback(() => {
    setDraggedCol(null);
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent, key: string, currentWidth: number) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = currentWidth;
    resizingRef.current = { key, startX, startWidth };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!resizingRef.current) return;
      const diff = ev.clientX - resizingRef.current.startX;
      const col = columns.find(c => c.key === resizingRef.current!.key);
      const min = col?.minWidth || 60;
      const newWidth = Math.max(min, resizingRef.current.startWidth + diff);
      setColumnWidths(prev => ({ ...prev, [resizingRef.current!.key]: newWidth }));
    };

    const handleMouseUp = () => {
      resizingRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [columns]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto -mx-px">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {orderedColumns.map((col) => {
                const w = columnWidths[col.key];
                return (
                  <th
                    key={col.key}
                    draggable
                    onDragStart={() => handleDragStart(col.key)}
                    onDragOver={(e) => handleDragOver(e, col.key)}
                    onDragEnd={handleDragEnd}
                    className={`px-3 sm:px-6 py-3 sm:py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest select-none relative group ${draggedCol === col.key ? 'opacity-50' : ''}`}
                    style={w ? { width: w, minWidth: w } : undefined}
                  >
                    <div className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing">
                      <GripVertical size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      <span>{col.label}</span>
                    </div>
                    <div
                      className="absolute right-0 top-2 bottom-2 w-1 cursor-col-resize hover:bg-blue-400 transition-colors rounded-full"
                      onMouseDown={(e) => {
                        const th = (e.target as HTMLElement).closest('th');
                        handleResizeStart(e, col.key, th?.offsetWidth || 150);
                      }}
                    />
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? data.map((item, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(item)}
                className={`group hover:bg-slate-50/80 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {orderedColumns.map((col) => {
                  const w = columnWidths[col.key];
                  return (
                    <td
                      key={col.key}
                      className="px-3 sm:px-6 py-3 sm:py-5"
                      style={w ? { width: w, minWidth: w } : undefined}
                    >
                      {col.render(item)}
                    </td>
                  );
                })}
              </tr>
            )) : (
              <tr>
                <td colSpan={orderedColumns.length} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-40">
                    {emptyIcon}
                    <p className="text-lg font-medium text-slate-400">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
