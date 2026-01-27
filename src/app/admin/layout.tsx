import { signOut } from '@/auth';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            <div style={{ display: 'flex', flex: 1 }}>
                <div style={{
                    width: '250px',
                    backgroundColor: 'var(--bg-tertiary)',
                    padding: '24px',
                    borderRight: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    height: '100vh'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', color: 'var(--text-primary)', fontWeight: 'bold' }}>Admin Panel</h2>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <a href="/admin/dashboard" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>Dashboard</a>
                            <a href="/admin/users" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>Users</a>
                            <a href="/admin/inboxes" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>Inboxes</a>
                            <a href="/admin/domains" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>Domains</a>
                        </nav>
                    </div>
                    <form
                        action={async () => {
                            'use server';
                            await signOut();
                        }}
                    >
                        <button className="btn btn-secondary" style={{ width: '100%' }}>
                            Sign Out
                        </button>
                    </form>
                </div>
                <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
