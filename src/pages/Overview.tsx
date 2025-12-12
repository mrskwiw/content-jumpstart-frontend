import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { projectsApi } from '@/api/projects';
import { deliverablesApi } from '@/api/deliverables';
import { runsApi } from '@/api/runs';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
  FileText,
  Activity
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue'
}: {
  title: string;
  value: number | string;
  icon: any;
  trend?: string;
  color?: 'blue' | 'emerald' | 'amber' | 'indigo';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
          {trend && <p className="mt-1 text-xs text-slate-500">{trend}</p>}
        </div>
        <div className={`rounded-lg p-3 ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

export default function Overview() {
  const navigate = useNavigate();

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.list({}),
  });

  const { data: deliverables = [] } = useQuery({
    queryKey: ['deliverables'],
    queryFn: () => deliverablesApi.list({}),
  });

  const { data: runs = [] } = useQuery({
    queryKey: ['runs'],
    queryFn: () => runsApi.list({}),
  });

  // Calculate metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p =>
    p.status === 'generating' || p.status === 'qa' || p.status === 'ready'
  ).length;
  const completedProjects = projects.filter(p =>
    p.status === 'delivered' || p.status === 'exported'
  ).length;
  const pendingDeliverables = deliverables.filter(d => d.status === 'ready').length;

  // Recent activity - combine projects and deliverables
  const recentActivity = [
    ...projects
      .filter(p => p.lastRunAt)
      .map(p => ({
        type: 'project' as const,
        id: p.id,
        name: p.name,
        action: p.status === 'delivered' ? 'delivered' : 'updated',
        timestamp: new Date(p.lastRunAt!),
      })),
    ...deliverables
      .filter(d => d.deliveredAt)
      .map(d => ({
        type: 'deliverable' as const,
        id: d.id,
        name: d.projectId,
        action: 'marked delivered',
        timestamp: new Date(d.deliveredAt!),
      })),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Overview</h1>
        <p className="text-sm text-slate-600">
          Dashboard overview of projects, deliverables, and recent activity.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={totalProjects}
          icon={FolderKanban}
          color="blue"
          trend={`${activeProjects} active`}
        />
        <StatCard
          title="Completed"
          value={completedProjects}
          icon={CheckCircle2}
          color="emerald"
          trend={`${Math.round((completedProjects / totalProjects) * 100) || 0}% completion rate`}
        />
        <StatCard
          title="Pending Delivery"
          value={pendingDeliverables}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Total Runs"
          value={runs.length}
          icon={TrendingUp}
          color="indigo"
        />
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => navigate('/dashboard/wizard')}
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-left transition-colors hover:border-blue-600 hover:bg-blue-50"
          >
            <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">Start Wizard</div>
              <div className="text-xs text-slate-600">Create new project</div>
            </div>
          </button>

          <button
            onClick={() => navigate('/dashboard/projects')}
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-left transition-colors hover:border-emerald-600 hover:bg-emerald-50"
          >
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">View Projects</div>
              <div className="text-xs text-slate-600">{totalProjects} total projects</div>
            </div>
          </button>

          <button
            onClick={() => navigate('/dashboard/deliverables')}
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-left transition-colors hover:border-indigo-600 hover:bg-indigo-50"
          >
            <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">Deliverables</div>
              <div className="text-xs text-slate-600">{pendingDeliverables} pending</div>
            </div>
          </button>

          <button
            onClick={() => navigate('/dashboard/settings')}
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-left transition-colors hover:border-amber-600 hover:bg-amber-50"
          >
            <div className="rounded-lg bg-amber-100 p-2 text-amber-600">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">Settings</div>
              <div className="text-xs text-slate-600">Configure system</div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((item, idx) => (
              <div
                key={`${item.type}-${item.id}-${idx}`}
                className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  {item.type === 'project' ? (
                    <div className="rounded-lg bg-blue-50 p-2">
                      <FolderKanban className="h-4 w-4 text-blue-600" />
                    </div>
                  ) : (
                    <div className="rounded-lg bg-emerald-50 p-2">
                      <FileText className="h-4 w-4 text-emerald-600" />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {item.type === 'project' ? 'Project' : 'Deliverable'} {item.action}
                    </div>
                    <div className="text-xs text-slate-600">{item.name}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">Project Status Breakdown</h3>
          <div className="space-y-2">
            {['draft', 'generating', 'qa', 'ready', 'exported', 'delivered'].map(status => {
              const count = projects.filter(p => p.status === status).length;
              if (count === 0) return null;
              return (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-slate-700">{status}</span>
                  <span className="font-semibold text-slate-900">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-slate-900">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">API Status</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Mock Mode</span>
              <span className="text-xs font-semibold text-amber-700">
                {process.env.VITE_USE_MOCKS === 'true' ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-700">Last Updated</span>
              <span className="text-xs text-slate-600">
                {format(new Date(), 'PPp')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
