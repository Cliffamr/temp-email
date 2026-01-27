'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Info, X } from 'lucide-react';

export default function RestoreInboxForm() {
    const router = useRouter();
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/inboxes/restore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 410) {
                    setError('This inbox has expired and can no longer be accessed.');
                } else if (response.status === 404) {
                    setError('Inbox not found. Please check the email address.');
                } else {
                    setError(data.error || 'Failed to restore inbox');
                }
                return;
            }

            router.push(`/inbox/${data.data.inboxId}`);
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
            <div className="alert alert-info" style={{ marginBottom: 24 }}>
                <Info size={20} />
                <span>Enter your email address to access your inbox.</span>
            </div>

            {error && (
                <div className="alert alert-error" style={{ marginBottom: 24 }}>
                    <X size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className="input-group">
                <label htmlFor="address" className="input-label">
                    Email Address
                </label>
                <input
                    type="email"
                    id="address"
                    className="input"
                    placeholder="your-alias@domain.com"
                    value={address}
                    onChange={(e) => setAddress(e.target.value.toLowerCase())}
                    required
                    autoFocus
                    autoComplete="email"
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || !address}
                style={{ width: '100%', marginTop: 8 }}
            >
                {isLoading ? (
                    <>
                        <span className="spinner" style={{ width: 16, height: 16 }}></span>
                        Restoring...
                    </>
                ) : (
                    'Access Inbox'
                )}
            </button>
        </form>
    );
}
