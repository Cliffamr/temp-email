import prisma from '@/lib/db';
import { deleteInbox } from '../actions';
import { Trash2 } from 'lucide-react';

export default async function InboxesPage() {
    const inboxes = await prisma.inbox.findMany({
        orderBy: { createdAt: 'desc' },
        include: { domain: true }
    });

    return (
        <main>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Inboxes</h1>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                        <tr>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Address</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Created</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Last Access</th>
                            <th style={{ padding: '16px', textAlign: 'right', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inboxes.map((inbox) => (
                            <tr key={inbox.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px' }}>{inbox.address}</td>
                                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{inbox.createdAt.toLocaleDateString()}</td>
                                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{inbox.lastAccessAt.toLocaleDateString()}</td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <form action={deleteInbox.bind(null, inbox.id)}>
                                        <button type="submit" className="btn btn-ghost" style={{ color: 'var(--error)', padding: '8px' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
