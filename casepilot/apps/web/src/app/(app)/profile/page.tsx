'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.cases.stats().then(setStats).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.users.updateProfile({ name, email });
      toast({ type: 'success', title: 'Profile updated' });
    } catch (e: any) {
      toast({ type: 'error', title: 'Update failed', body: e.message });
    } finally {
      setSaving(false);
    }
  };

  const maskedMobile = user?.mobile.replace(/^(\d{2})\d{6}(\d{2})$/, '$1XXXXXX$2') ?? '';

  return (
    <>
      <header className="topbar">
        <div className="topbar-title">Profile</div>
      </header>

      <main className="page-content" id="main-content" style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Avatar + info */}
        <div className="card" style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-primary), #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'white', margin: '0 auto 12px' }}>
            {(user?.name ?? 'U')[0].toUpperCase()}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.name}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>+91 {maskedMobile}</div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid-3" style={{ marginBottom: 16, gap: 10 }}>
            {[
              { label: 'Total Cases', value: stats.total },
              { label: 'Active', value: stats.total - stats.closed - stats.draft },
              { label: 'Resolved', value: stats.closed },
            ].map(({ label, value }) => (
              <div key={label} className="card" style={{ textAlign: 'center', padding: 14 }}>
                <div style={{ fontSize: 24, fontWeight: 800 }}>{value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Edit form */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 16 }}>Edit Profile</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label htmlFor="p-name" className="form-label">Full Name</label>
              <input id="p-name" type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="p-email" className="form-label">Email</label>
              <input id="p-email" type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile</label>
              <input type="text" className="form-input" value={`+91 ${maskedMobile}`} disabled style={{ opacity: 0.6 }} aria-label="Mobile number (masked)" />
              <div className="form-hint">Mobile number cannot be changed</div>
            </div>
            <button className="btn btn-primary" onClick={save} disabled={saving} aria-busy={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="card" style={{ border: '1px solid rgba(239,68,68,0.15)' }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: 'var(--error)' }}>Sign Out</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
            You will be redirected to the login page.
          </div>
          <button className="btn btn-danger" onClick={logout}>Sign Out</button>
        </div>
      </main>
    </>
  );
}
