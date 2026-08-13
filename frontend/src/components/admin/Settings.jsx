import React, { useState } from 'react';
import AdminLayout from './AdminLayout';

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Septexa',
    siteDescription: 'One platform. Every AI.',
    maintenanceMode: false,
    allowRegistrations: true,
    defaultUserRole: 'user',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Settings</h1>
        <p className="text-[#9297a6] text-sm">Configure your platform settings.</p>
      </div>

      <div className="bg-[#0d0d11] border border-[#1b1b23] rounded-xl p-6 max-w-2xl">
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          {/* Site Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 font-['Space_Grotesk']">General Settings</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#9297a6] mb-1">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="w-full px-4 py-2 bg-[#17171e] border border-[#1b1b23] rounded-lg text-[#eef0f5] text-sm outline-none focus:border-[#2dd4ff] transition-colors"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#9297a6] mb-1">Site Description</label>
              <input
                type="text"
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                className="w-full px-4 py-2 bg-[#17171e] border border-[#1b1b23] rounded-lg text-[#eef0f5] text-sm outline-none focus:border-[#2dd4ff] transition-colors"
              />
            </div>
          </div>

          {/* User Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 font-['Space_Grotesk']">User Settings</h3>
            
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Allow Registrations</p>
                <p className="text-xs text-[#5c6070]">Allow new users to create accounts</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({...settings, allowRegistrations: !settings.allowRegistrations})}
                className={`relative w-12 h-6 rounded-full transition-colors ${settings.allowRegistrations ? 'bg-[#2dd4ff]' : 'bg-[#17171e]'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.allowRegistrations ? 'translate-x-6' : ''}`}></span>
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Maintenance Mode</p>
                <p className="text-xs text-[#5c6070]">Put the site in maintenance mode</p>
              </div>
              <button
                type="button"
                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                className={`relative w-12 h-6 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-[#fb5d78]' : 'bg-[#17171e]'}`}
              >
                <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-6' : ''}`}></span>
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#9297a6] mb-1">Default User Role</label>
              <select
                value={settings.defaultUserRole}
                onChange={(e) => setSettings({...settings, defaultUserRole: e.target.value})}
                className="w-full px-4 py-2 bg-[#17171e] border border-[#1b1b23] rounded-lg text-[#eef0f5] text-sm outline-none focus:border-[#2dd4ff] transition-colors"
              >
                <option value="user">User</option>
                <option value="moderator">Moderator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-gradient-to-r from-[#2dd4ff] to-[#8b5cf6] text-[#050208] rounded-lg font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {saved && (
              <span className="text-sm text-[#4fd18b]">✓ Settings saved successfully!</span>
            )}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Settings;