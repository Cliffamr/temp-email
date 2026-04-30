'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Copy, AlertTriangle, Info, X, Shuffle } from 'lucide-react';

const ADJECTIVES = [
    'swift', 'bright', 'calm', 'dark', 'eager', 'fair', 'glad', 'happy',
    'keen', 'lucky', 'neat', 'proud', 'quick', 'rare', 'safe', 'tall',
    'warm', 'wise', 'bold', 'cool', 'deep', 'fast', 'gold', 'huge',
    'iron', 'jade', 'kind', 'lean', 'mild', 'nova', 'open', 'pure',
    'rich', 'slim', 'true', 'vast', 'wild', 'zen', 'blue', 'cyan',
    'dusk', 'epic', 'fern', 'glow', 'haze', 'icy', 'jazz', 'lush',
    'mint', 'neon', 'opal', 'pine', 'ruby', 'sage', 'teal', 'aqua',
];

const NOUNS = [
    'fox', 'owl', 'cat', 'wolf', 'bear', 'hawk', 'deer', 'lion',
    'star', 'moon', 'wind', 'rain', 'fire', 'leaf', 'wave', 'peak',
    'lake', 'reef', 'glen', 'cove', 'arch', 'mesa', 'dune', 'vale',
    'frog', 'dove', 'swan', 'lynx', 'crow', 'hare', 'puma', 'wren',
    'ruby', 'jade', 'onyx', 'opal', 'flux', 'bolt', 'beam', 'glow',
    'mist', 'dawn', 'dusk', 'echo', 'fury', 'halo', 'iris', 'nova',
    'orb', 'pike', 'quay', 'rift', 'sage', 'tide', 'veil', 'zeal',
];

function generateRandomAlias(): string {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 900) + 100; // 100–999
    return `${adj}-${noun}-${num}`;
}

interface CreatedInbox {
    inboxId: string;
    address: string;
    token: string;
    publicExpiresAt: string;
}

export default function CreateInboxForm() {
    const router = useRouter();
    const [alias, setAlias] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');
    const [domains, setDomains] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [createdInbox, setCreatedInbox] = useState<CreatedInbox | null>(null);
    const [copied, setCopied] = useState<'address' | 'token' | null>(null);

    const handleRandomize = useCallback(() => {
        setAlias(generateRandomAlias());
    }, []);

    useEffect(() => {
        // Auto-generate a random alias on mount
        handleRandomize();

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
    }, [handleRandomize]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/inboxes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alias, domain: selectedDomain }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Failed to create inbox');
                return;
            }

            if (data.isRestored) {
                // If it already existed, just redirect them directly to the inbox
                router.push(`/inbox/${data.data.inboxId}`);
                return;
            }

            setCreatedInbox(data.data);
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async (text: string, type: 'address' | 'token') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const goToInbox = () => {
        if (createdInbox) {
            router.push(`/inbox/${createdInbox.inboxId}`);
        }
    };

    if (createdInbox) {
        return (
            <div className="card animate-fade-in" style={{ maxWidth: 560, margin: '0 auto' }}>
                <div className="alert alert-success" style={{ marginBottom: 24 }}>
                    <Check size={20} />
                    <span>Your temporary email inbox has been created!</span>
                </div>

                <div className="token-display">
                    <label className="input-label">Email Address</label>
                    <div className="token-value">
                        <code>{createdInbox.address}</code>
                        <button
                            className="copy-btn"
                            onClick={() => copyToClipboard(createdInbox.address, 'address')}
                            title="Copy address"
                        >
                            {copied === 'address' ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                </div>

                <div className="token-display">
                    <label className="input-label">Access Token</label>
                    <div className="alert alert-warning" style={{ marginBottom: 12 }}>
                        <AlertTriangle size={20} />
                        <span>Save this token! It will only be shown once. You need it to restore access to this inbox.</span>
                    </div>
                    <div className="token-value">
                        <code style={{ fontSize: '0.75rem' }}>{createdInbox.token}</code>
                        <button
                            className="copy-btn"
                            onClick={() => copyToClipboard(createdInbox.token, 'token')}
                            title="Copy token"
                        >
                            {copied === 'token' ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>
                </div>

                <div style={{ marginTop: 24 }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                        Public access expires: {new Date(createdInbox.publicExpiresAt).toLocaleString()}
                    </p>
                    <button className="btn btn-primary" onClick={goToInbox} style={{ width: '100%' }}>
                        Go to Inbox →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 560, margin: '0 auto' }}>
            <div className="alert alert-info" style={{ marginBottom: 24 }}>
                <Info size={20} />
                <span>For testing purposes only. Do not use for sensitive communications.</span>
            </div>

            {error && (
                <div className="alert alert-error" style={{ marginBottom: 24 }}>
                    <X size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className="input-group">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label htmlFor="alias" className="input-label" style={{ marginBottom: 0 }}>
                        Email Alias
                    </label>
                    <button
                        type="button"
                        className="random-btn"
                        onClick={handleRandomize}
                        title="Generate random alias"
                    >
                        <Shuffle size={14} />
                        Random
                    </button>
                </div>
                <div className="input-with-addon">
                    <input
                        type="text"
                        id="alias"
                        className="input"
                        placeholder="your-alias"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value.toLowerCase())}
                        minLength={3}
                        maxLength={32}
                        required
                        autoComplete="off"
                    />
                    <span className="input-addon">@</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 8 }}>
                    3-32 characters. Letters, numbers, dots, hyphens, and underscores allowed.
                </p>
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
                        Creating...
                    </>
                ) : (
                    'Create Inbox'
                )}
            </button>
        </form>
    );
}
