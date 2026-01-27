'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Info, X } from 'lucide-react';

export default function RestoreInboxForm() {
    const router = useRouter();
    const [alias, setAlias] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');
    const [domains, setDomains] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch available domains
        fetch('/api/inboxes')
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.data.domains.length > 0) {
                    setDomains(data.data.domains);
                    setSelectedDomain(data.data.domains[0]);
                }
            })
            .catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const address = `${alias}@${selectedDomain}`;
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
                <span>Enter your email alias to access your inbox.</span>
            </div>

            {error && (
                <div className="alert alert-error" style={{ marginBottom: 24 }}>
                    <X size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className="input-group">
                <label htmlFor="alias" className="input-label">
                    Email Alias
                </label>
                <div className="input-with-addon">
                    <input
                        type="text"
                        id="alias"
                        className="input"
                        placeholder="your-alias"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value.toLowerCase())}
                        required
                        autoFocus
                        autoComplete="off"
                    />
                    <span className="input-addon">@</span>
                </div>
            </div>

            <div className="input-group">
                <label htmlFor="domain" className="input-label">
                    Domain
                </label>
                <select
                    id="domain"
                    className="input"
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    required
                >
                    {domains.length === 0 ? (
                        <option value="">Loading domains...</option>
                    ) : (
                        domains.map((domain) => (
                            <option key={domain} value={domain}>
                                {domain}
                            </option>
                        ))
                    )}
                </select>
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || !alias || !selectedDomain}
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
