'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { X, Copy, MailOpen } from 'lucide-react';

interface Message {
    id: string;
    from: string;
    subject: string;
    date: string;
    preview: string;
    size: number;
}

interface InboxData {
    address: string;
    publicExpiresAt: string;
}

interface MessageListProps {
    inboxId: string;
}

export default function MessageList({ inboxId }: MessageListProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inbox, setInbox] = useState<InboxData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    const fetchMessages = useCallback(async () => {
        try {
            const response = await fetch(`/api/inboxes/${inboxId}/messages`);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 410) {
                    setError('This inbox has expired.');
                } else if (response.status === 404) {
                    setError('Inbox not found.');
                } else {
                    setError(data.error || 'Failed to fetch messages');
                }
                return;
            }

            setMessages(data.data.messages);
            setInbox(data.data.inbox);
            setLastRefresh(new Date());
            setError('');
        } catch (err) {
            setError('Network error. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    }, [inboxId]);

    useEffect(() => {
        fetchMessages();

        // Poll every 5 seconds
        const interval = setInterval(fetchMessages, 5000);

        return () => clearInterval(interval);
    }, [fetchMessages]);

    const copyAddress = async () => {
        if (inbox) {
            try {
                await navigator.clipboard.writeText(inbox.address);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
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
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                    <Link href="/" className="btn btn-primary">
                        Create New Inbox
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            {inbox && (
                <div className="inbox-header">
                    <div className="inbox-address">
                        <span>{inbox.address}</span>
                        <button className="copy-btn" onClick={copyAddress} title="Copy address">
                            <Copy size={16} />
                        </button>
                    </div>
                    <div className="inbox-actions">
                        <div className="refresh-indicator">
                            <span className="refresh-dot"></span>
                            <span>Auto-refresh active</span>
                        </div>
                    </div>
                </div>
            )}

            {inbox && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 24 }}>
                    Public access expires: {new Date(inbox.publicExpiresAt).toLocaleString()}
                </p>
            )}

            {messages.length === 0 ? (
                <div className="card empty-state">
                    <div className="empty-state-icon"><MailOpen size={48} strokeWidth={1.5} /></div>
                    <h3>No messages yet</h3>
                    <p>Emails sent to this address will appear here automatically.</p>
                    <p style={{ marginTop: 16, fontSize: '0.8125rem' }}>
                        Last checked: {lastRefresh.toLocaleTimeString()}
                    </p>
                </div>
            ) : (
                <div className="message-list">
                    {messages.map((message) => (
                        <Link
                            key={message.id}
                            href={`/inbox/${inboxId}/message/${message.id}`}
                            className="message-item animate-fade-in"
                        >
                            <div>
                                <div className="message-from">{message.from || 'Unknown Sender'}</div>
                                <div className="message-subject">{message.subject}</div>
                                <div className="message-preview">{message.preview || 'No preview available'}</div>
                            </div>
                            <div className="message-date">{formatDate(message.date)}</div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
