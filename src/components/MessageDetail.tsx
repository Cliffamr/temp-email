'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Trash2 } from 'lucide-react';

interface MessageData {
    id: string;
    from: string;
    to: string;
    subject: string;
    date: string;
    text: string;
    html: string;
    headers: Record<string, string>;
    size: number;
    createdAt: string;
}

interface MessageDetailProps {
    inboxId: string;
    messageId: string;
}

export default function MessageDetail({ inboxId, messageId }: MessageDetailProps) {
    const router = useRouter();
    const [message, setMessage] = useState<MessageData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState<'html' | 'text'>('html');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const response = await fetch(`/api/inboxes/${inboxId}/messages/${messageId}`);
                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || 'Failed to fetch message');
                    return;
                }

                setMessage(data.data);
                // Default to text view if no HTML content
                if (!data.data.html) {
                    setViewMode('text');
                }
            } catch (err) {
                setError('Network error. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessage();
    }, [inboxId, messageId]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this message?')) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch(`/api/inboxes/${inboxId}/messages/${messageId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                router.push(`/inbox/${inboxId}`);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to delete message');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    if (isLoading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card">
                <div className="alert alert-error">
                    <X size={20} />
                    <span>{error}</span>
                </div>
                <div style={{ marginTop: 16 }}>
                    <Link href={`/inbox/${inboxId}`} className="btn btn-secondary">
                        ← Back to Inbox
                    </Link>
                </div>
            </div>
        );
    }

    if (!message) {
        return null;
    }

    return (
        <div className="card animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <Link href={`/inbox/${inboxId}`} className="btn btn-ghost">
                    ← Back to Inbox
                </Link>
                <button
                    className="btn btn-ghost"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    style={{ color: 'var(--error)' }}
                >
                    {isDeleting ? 'Deleting...' : <><Trash2 size={16} /> Delete</>}
                </button>
            </div>

            {/* Subject */}
            <h2 style={{ marginBottom: 24, wordBreak: 'break-word' }}>{message.subject}</h2>

            {/* Message Meta */}
            <div className="message-header">
                <dl className="message-meta">
                    <dt>From:</dt>
                    <dd>{message.from || 'Unknown'}</dd>
                    <dt>To:</dt>
                    <dd>{message.to}</dd>
                    <dt>Date:</dt>
                    <dd>{formatDate(message.date)}</dd>
                    <dt>Size:</dt>
                    <dd>{formatSize(message.size)}</dd>
                </dl>
            </div>

            {/* View Toggle */}
            {message.html && message.text && (
                <div className="view-toggle" style={{ marginBottom: 20 }}>
                    <button
                        className={`view-toggle-btn ${viewMode === 'html' ? 'active' : ''}`}
                        onClick={() => setViewMode('html')}
                    >
                        HTML
                    </button>
                    <button
                        className={`view-toggle-btn ${viewMode === 'text' ? 'active' : ''}`}
                        onClick={() => setViewMode('text')}
                    >
                        Plain Text
                    </button>
                </div>
            )}

            {/* Message Body */}
            <div className="message-body">
                {viewMode === 'html' && message.html ? (
                    <div
                        className="message-body-html"
                        dangerouslySetInnerHTML={{ __html: message.html }}
                    />
                ) : (
                    <pre className="message-body-text">
                        {message.text || 'No text content available.'}
                    </pre>
                )}
            </div>
        </div>
    );
}
