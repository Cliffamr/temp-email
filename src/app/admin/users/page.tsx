import prisma from '@/lib/db';
import { createUser, deleteUser } from '../actions';
import { Trash2 } from 'lucide-react';

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <main>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Users</h1>
            </div>

            <div className="card" style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.125rem', marginBottom: '16px' }}>Add New User</h2>
                <form action={createUser} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="input"
                        style={{ flex: 1, minWidth: '200px' }}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="input"
                        style={{ flex: 1, minWidth: '200px' }}
                        required
                    />
                    <select name="role" className="input" style={{ width: 'auto' }}>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <button type="submit" className="btn btn-primary">Add User</button>
                </form>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                        <tr>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Email</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Role</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Created</th>
                            <th style={{ padding: '16px', textAlign: 'right', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '16px' }}>{user.email}</td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        background: user.role === 'ADMIN' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                                        color: user.role === 'ADMIN' ? '#a5b4fc' : '#4ade80',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{user.createdAt.toLocaleDateString()}</td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <form action={deleteUser.bind(null, user.id)}>
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
