import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { WizardStepper } from '@/components/wizard/WizardStepper';
import { ClientProfilePanel } from '@/components/wizard/ClientProfilePanel';
import { TemplateSelectionPanel } from '@/components/wizard/TemplateSelectionPanel';
import { GenerationPanel } from '@/components/wizard/GenerationPanel';
import { QualityGatePanel } from '@/components/wizard/QualityGatePanel';
import { ExportPanel } from '@/components/wizard/ExportPanel';
import { postsApi } from '@/api/posts';
import { runsApi } from '@/api/runs';
import { projectsApi } from '@/api/projects';
import type { ClientBrief } from '@/types/domain';

type StepKey = 'profile' | 'templates' | 'generate' | 'quality' | 'export';

const steps: { key: StepKey; label: string }[] = [
  { key: 'profile', label: 'Client Profile' },
  { key: 'templates', label: 'Templates' },
  { key: 'generate', label: 'Generate' },
  { key: 'quality', label: 'Quality Gate' },
  { key: 'export', label: 'Export' },
];

export default function Wizard() {
  const location = useLocation();
  const projectId = (location.state as { projectId?: string })?.projectId || 'project-demo';
  const clientId = (location.state as { clientId?: string })?.clientId || 'client-demo';

  const [activeStep, setActiveStep] = useState<StepKey>('profile');
  const [clientBrief, setClientBrief] = useState<ClientBrief | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const qc = useQueryClient();

  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectsApi.get(projectId),
    enabled: !!projectId,
  });

  const { data: runs } = useQuery({
    queryKey: ['runs', { projectId }],
    queryFn: () => runsApi.list({ projectId }),
    enabled: !!projectId,
  });

  const { data: posts, refetch: refetchPosts } = useQuery({
    queryKey: ['posts', { projectId }],
    queryFn: () => postsApi.list({ projectId }),
    enabled: !!projectId,
  });

  const flagged = (posts ?? []).filter((p) => p.status === 'flagged' || (p.flags && p.flags.length > 0));

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Project Wizard</h1>
        <p className="text-sm text-slate-600">
          Multi-step flow for client profile → templates → generation → quality gate → export.
        </p>
      </header>

      <WizardStepper steps={steps} active={activeStep} onChange={(k) => setActiveStep(k as StepKey)} />

      {activeStep === 'profile' && (
        <ClientProfilePanel
          projectId={projectId}
          initialData={clientBrief || undefined}
          onSave={(brief) => {
            setClientBrief(brief);
            setActiveStep('templates');
          }}
        />
      )}

      {activeStep === 'templates' && (
        <TemplateSelectionPanel
          initialSelection={selectedTemplates}
          onContinue={(templateIds) => {
            setSelectedTemplates(templateIds);
            setActiveStep('generate');
          }}
        />
      )}

      {activeStep === 'generate' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <GenerationPanel
            projectId={projectId}
            clientId={clientId}
            onStarted={() => {
              qc.invalidateQueries({ queryKey: ['runs', { projectId }] });
              refetchPosts();
              setActiveStep('quality');
            }}
          />
          <QualityGatePanel
            posts={posts ?? []}
            projectId={projectId}
            onRegenerated={() => {
              refetchPosts();
            }}
          />
        </div>
      )}

      {activeStep === 'quality' && (
        <div className="space-y-4">
          <QualityGatePanel
            posts={posts ?? []}
            projectId={projectId}
            onRegenerated={() => {
              refetchPosts();
            }}
          />
          <div className="flex justify-end">
            <button
              onClick={() => setActiveStep('export')}
              disabled={flagged.length > 0}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {flagged.length > 0 ? `${flagged.length} posts flagged - fix before exporting` : 'Continue to Export'}
            </button>
          </div>
        </div>
      )}

      {activeStep === 'export' && (
        <ExportPanel
          projectId={projectId}
          clientId={clientId}
          onExported={() => {
            qc.invalidateQueries({ queryKey: ['deliverables'] });
          }}
        />
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Wizard Status</h3>
        <div className="mt-2 space-y-1">
          <p className="text-xs text-slate-600">
            <strong>Project:</strong> {project?.name || projectId}
          </p>
          <p className="text-xs text-slate-600">
            <strong>Client Brief:</strong> {clientBrief ? '✓ Saved' : 'Not set'}
          </p>
          <p className="text-xs text-slate-600">
            <strong>Templates:</strong> {selectedTemplates.length > 0 ? `${selectedTemplates.length} selected` : 'None selected'}
          </p>
          <p className="text-xs text-slate-600">
            <strong>Posts:</strong> {posts?.length ?? 0} generated
          </p>
          <p className="text-xs text-slate-600">
            <strong>Flagged:</strong> {flagged.length}
          </p>
          <p className="text-xs text-slate-600">
            <strong>Runs:</strong> {runs?.length ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}
