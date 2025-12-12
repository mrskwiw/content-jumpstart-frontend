import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliverablesApi } from '@/api/deliverables';
import type { Deliverable, DeliverableStatus, MarkDeliveredInput } from '@/types/domain';
import { Filter, Link as LinkIcon, RefreshCw, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { DeliverableDrawer } from '@/components/deliverables/DeliverableDrawer';

function StatusChip({ status }: { status: DeliverableStatus }) {
  const map: Record<DeliverableStatus, string> = {
    draft: 'bg-slate-100 text-slate-700',
    ready: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${map[status]}`}>{status}</span>;
}

interface MarkDialogProps {
  deliverable: Deliverable | null;
  onClose: () => void;
  onSubmit: (input: MarkDeliveredInput) => void;
  isSubmitting: boolean;
}

function MarkDeliveredDialog({ deliverable, onClose, onSubmit, isSubmitting }: MarkDialogProps) {
  const [proofUrl, setProofUrl] = useState('');
  const [proofNotes, setProofNotes] = useState('');
  if (!deliverable) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Mark Delivered</h3>
            <p className="text-sm text-slate-600">ID: {deliverable.id}</p>
          </div>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-800">
            Close
          </button>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-800">Proof URL (optional)</label>
            <input
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://example.com/proof"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-800">Proof notes (optional)</label>
            <textarea
              value={proofNotes}
              onChange={(e) => setProofNotes(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            onClick={() =>
              onSubmit({
                deliveredAt: new Date().toISOString(),
                proofUrl: proofUrl || undefined,
                proofNotes: proofNotes || undefined,
              })
            }
            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Mark Delivered'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Deliverables() {
  const [status, setStatus] = useState<DeliverableStatus | ''>('');
  const [selected, setSelected] = useState<Deliverable | null>(null);
  const qc = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['deliverables', { status }],
    queryFn: () => deliverablesApi.list({ status: status || undefined }),
  });

  const deliverables = data ?? [];

  const groups = useMemo(() => {
    const map = new Map<string, Deliverable[]>();
    deliverables.forEach((d) => {
      const key = `${d.clientId}::${d.projectId}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(d);
    });
    return Array.from(map.entries()).map(([key, items]) => {
      const [clientId, projectId] = key.split('::');
      return { clientId, projectId, items };
    });
  }, [deliverables]);

  const markDelivered = useMutation({
    mutationFn: (input: MarkDeliveredInput) => {
      if (!selected) throw new Error('No deliverable selected');
      return deliverablesApi.markDelivered(selected.id, input);
    },
    onSuccess: async () => {
      setSelected(null);
      await qc.invalidateQueries({ queryKey: ['deliverables'] });
    },
  });

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Deliverables</h1>
          <p className="text-sm text-slate-600">Track export outputs, statuses, and delivery proof.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </header>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              className="bg-transparent text-sm text-slate-800 outline-none"
              value={status}
              onChange={(e) => setStatus(e.target.value as DeliverableStatus | '')}
            >
              <option value="">All statuses</option>
              {['draft', 'ready', 'delivered'].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {isLoading && <div className="text-sm text-slate-500">Loading deliverables...</div>}
          {isError && <div className="text-sm text-rose-600">Failed to load deliverables.</div>}
          {!isLoading && !isError && groups.length === 0 && (
            <div className="text-sm text-slate-500">No deliverables found.</div>
          )}
          {groups.map((group) => (
            <div key={`${group.clientId}-${group.projectId}`} className="rounded-lg border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Client {group.clientId}</p>
                  <p className="text-xs text-slate-500">Project {group.projectId}</p>
                </div>
              </div>
              <div className="divide-y divide-slate-200">
                {group.items.map((d) => (
                  <div key={d.id} className="flex items-center justify-between px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {d.format.toUpperCase()} • {d.path}
                        </span>
                        <StatusChip status={d.status} />
                      </div>
                      <div className="text-xs text-slate-500">
                        Created {format(new Date(d.createdAt), 'PP p')}
                        {d.runId ? ` • Run ${d.runId}` : ''}
                        {d.deliveredAt ? ` • Delivered ${format(new Date(d.deliveredAt), 'PP p')}` : ''}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(d)}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                      >
                        <LinkIcon className="h-4 w-4" />
                        Details
                      </button>
                      {d.proofUrl && (
                        <a
                          href={d.proofUrl}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                        >
                          <LinkIcon className="h-4 w-4" />
                          Proof
                        </a>
                      )}
                      {d.status !== 'delivered' && (
                        <button
                          onClick={() => setSelected(d)}
                          className="inline-flex items-center gap-1 rounded-md bg-green-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <MarkDeliveredDialog
        deliverable={selected}
        onClose={() => setSelected(null)}
        onSubmit={(input) => markDelivered.mutate(input)}
        isSubmitting={markDelivered.isPending}
      />
      <DeliverableDrawer deliverable={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
