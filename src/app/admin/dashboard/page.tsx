import prisma from '@/lib/db';

export default async function DashboardPage() {
    const inboxCount = await prisma.inbox.count();
    const domainCount = await prisma.domain.count();
    const totalMessages = await prisma.message.count();

    const recentInboxes = await prisma.inbox.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { domain: true }
    });

    return (
        <main>
            <h1 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>
                Dashboard Overview
            </h1>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '24px',
                marginBottom: '40px'
            }}>
                {/* Card 1 */}
                <div className="card">
                    <div style={{ marginBottom: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Inboxes</div>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {inboxCount}
                    </p>
                </div>
                {/* Card 2 */}
                <div className="card">
                    <div style={{ marginBottom: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Active Domains</div>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {domainCount}
                    </p>
                </div>
                {/* Card 3 */}
                <div className="card">
                    <div style={{ marginBottom: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Messages</div>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {totalMessages}
                    </p>
                </div>
            </div>

            <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Recent Inboxes</h2>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Address</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Created</th>
                                <th style={{ padding: '16px', textAlign: 'left', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Expires</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentInboxes.map((inbox) => (
                                <tr key={inbox.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '16px' }}>{inbox.address}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{inbox.createdAt.toLocaleDateString()}</td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{inbox.publicExpiresAt.toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
