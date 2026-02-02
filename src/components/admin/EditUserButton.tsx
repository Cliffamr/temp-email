'use client';

import { useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { updateUser } from '@/app/admin/actions';

interface EditUserButtonProps {
    user: {
        id: string;
        email: string;
        role: string;
    };
}

export default function EditUserButton({ user }: EditUserButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);
        try {
            await updateUser(formData);
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            alert('Failed to update user');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="btn btn-ghost"
                style={{ color: 'var(--text-secondary)', padding: '8px', marginRight: '8px' }}
                title="Edit User"
            >
                <Pencil size={16} />
            </button>

            {isOpen && (
                <div className="modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Edit User</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="btn btn-ghost"
                                style={{ padding: '8px' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input type="hidden" name="id" value={user.id} />

                            <div className="input-group">
                                <label className="input-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={user.email}
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Leave blank to keep current password"
                                    className="input"
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Role</label>
                                <select name="role" defaultValue={user.role} className="input">
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="btn btn-secondary"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
