import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Server, Database, TestTube, Bell, Shield, Save } from 'lucide-react';

interface SettingsData {
  apiUrl: string;
  useMocks: boolean;
  debugMode: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  theme: 'light' | 'dark' | 'system';
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>({
    apiUrl: process.env.VITE_API_URL || 'http://localhost:8000',
    useMocks: process.env.VITE_USE_MOCKS === 'true',
    debugMode: process.env.VITE_DEBUG_MODE === 'true',
    autoRefresh: localStorage.getItem('autoRefresh') === 'true',
    refreshInterval: parseInt(localStorage.getItem('refreshInterval') || '30000'),
    theme: (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('autoRefresh', settings.autoRefresh.toString());
    localStorage.setItem('refreshInterval', settings.refreshInterval.toString());
    localStorage.setItem('theme', settings.theme);

    // Show save confirmation
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setSettings({
      apiUrl: process.env.VITE_API_URL || 'http://localhost:8000',
      useMocks: process.env.VITE_USE_MOCKS === 'true',
      debugMode: process.env.VITE_DEBUG_MODE === 'true',
      autoRefresh: false,
      refreshInterval: 30000,
      theme: 'system',
    });
    localStorage.removeItem('autoRefresh');
    localStorage.removeItem('refreshInterval');
    localStorage.removeItem('theme');
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-600">
          Configure API connection, development tools, and application preferences.
        </p>
      </header>

      {/* API Configuration */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Server className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-900">API Configuration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-800">API Base URL</label>
            <input
              type="url"
              value={settings.apiUrl}
              onChange={(e) => setSettings({ ...settings, apiUrl: e.target.value })}
              placeholder="http://localhost:8000"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              disabled
            />
            <p className="mt-1 text-xs text-slate-500">
              Set via VITE_API_URL environment variable. Restart dev server to change.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-md border border-slate-200 p-4">
            <div>
              <div className="font-medium text-slate-900">Use Mock Data</div>
              <div className="text-xs text-slate-600">
                Enable mock API responses for development and testing
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${settings.useMocks ? 'text-amber-700' : 'text-slate-500'}`}>
                {settings.useMocks ? 'Enabled' : 'Disabled'}
              </span>
              <div className="relative h-6 w-11 rounded-full bg-slate-200">
                <div
                  className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    settings.useMocks ? 'translate-x-5 bg-amber-500' : ''
                  }`}
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Set via VITE_USE_MOCKS environment variable. Restart dev server to change.
          </p>
        </div>
      </div>

      {/* Development Tools */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <TestTube className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-slate-900">Development Tools</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-md border border-slate-200 p-4">
            <div>
              <div className="font-medium text-slate-900">Debug Mode</div>
              <div className="text-xs text-slate-600">
                Show detailed error messages and console logs
              </div>
            </div>
            <span className={`text-sm font-semibold ${settings.debugMode ? 'text-emerald-700' : 'text-slate-500'}`}>
              {settings.debugMode ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Set via VITE_DEBUG_MODE environment variable. Restart dev server to change.
          </p>
        </div>
      </div>

      {/* UI Preferences */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">UI Preferences</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-md border border-slate-200 p-4">
            <div>
              <div className="font-medium text-slate-900">Auto Refresh Data</div>
              <div className="text-xs text-slate-600">
                Automatically refresh project and deliverable data
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={settings.autoRefresh}
                onChange={(e) => setSettings({ ...settings, autoRefresh: e.target.checked })}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300"></div>
            </label>
          </div>

          {settings.autoRefresh && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">Refresh Interval (seconds)</label>
              <select
                value={settings.refreshInterval}
                onChange={(e) => setSettings({ ...settings, refreshInterval: parseInt(e.target.value) })}
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="10000">10 seconds</option>
                <option value="30000">30 seconds</option>
                <option value="60000">1 minute</option>
                <option value="300000">5 minutes</option>
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-800">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' | 'system' })}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
            <p className="mt-1 text-xs text-slate-500">
              Theme switching not yet implemented. Currently displays light mode.
            </p>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-rose-600" />
          <h2 className="text-lg font-semibold text-slate-900">Security</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-700">Session Token</span>
            <span className="font-mono text-xs text-slate-500">
              {localStorage.getItem('token') ? '••••••••' : 'Not set'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-700">Refresh Token</span>
            <span className="font-mono text-xs text-slate-500">
              {localStorage.getItem('refreshToken') ? '••••••••' : 'Not set'}
            </span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
            }}
            className="w-full rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
          >
            Clear Tokens & Logout
          </button>
        </div>
      </div>

      {/* Save Actions */}
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="text-sm text-slate-600">
          {saved ? (
            <span className="font-medium text-emerald-700">✓ Settings saved successfully</span>
          ) : (
            'Changes are saved to browser localStorage'
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            Save Preferences
          </button>
        </div>
      </div>

      {/* Environment Info */}
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-slate-900">Environment Variables</h3>
        <div className="space-y-1 font-mono text-xs text-slate-600">
          <div>VITE_API_URL: {process.env.VITE_API_URL || 'not set'}</div>
          <div>VITE_USE_MOCKS: {process.env.VITE_USE_MOCKS || 'not set'}</div>
          <div>VITE_DEBUG_MODE: {process.env.VITE_DEBUG_MODE || 'not set'}</div>
          <div>MODE: {process.env.MODE}</div>
        </div>
      </div>
    </div>
  );
}
