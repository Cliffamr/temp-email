import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';
import { deleteDomain, addDomain } from '../actions';
import { Trash2 } from 'lucide-react';

export default async function DomainsPage() {
    const domains = await prisma.domain.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { inboxes: true } } }
    });

    return (
        <main>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Domains</h1>
            </div>

            <div className="card" style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: '16px' }}>Add New Domain</h2>
                <form action={addDomain} style={{ display: 'flex', gap: '16px' }}>
                    <input
                        type="text"
                        name="domain"
                        placeholder="example.com"
                        className="input"
                        style={{ flex: 1 }}
                        required
                    />
                    <button type="submit" className="btn btn-primary">Add Domain</button>
                </form>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Domain</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Active Inboxes</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Created</th>
                                <th style={{ padding: '16px', textAlign: 'right', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {domains.map((domain) => (
                                <tr key={domain.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '16px' }}>{domain.domain}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{domain._count.inboxes}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{domain.createdAt.toLocaleDateString()}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <form action={deleteDomain.bind(null, domain.id)}>
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
            </div>
        </main>
    );
}
