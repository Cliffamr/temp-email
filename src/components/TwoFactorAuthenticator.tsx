'use client';

import { useState, useEffect, useCallback } from 'react';
import { Copy, Check, Eye, EyeOff, Trash2, Shield, Clock } from 'lucide-react';
import { generateTOTP, isValidBase32, getTimeRemaining, getProgress, normalizeSecret } from '@/lib/totp';

export default function TwoFactorAuthenticator() {
    const [secret, setSecret] = useState('');
    const [showSecret, setShowSecret] = useState(false);
    const [otp, setOtp] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(30);
    const [progress, setProgress] = useState(100);
    const [copied, setCopied] = useState<'otp' | 'secret' | null>(null);
    const [error, setError] = useState('');

    // Generate OTP when secret changes or timer expires
    const updateOTP = useCallback(() => {
        if (secret && isValidBase32(secret)) {
            try {
                const code = generateTOTP(secret);
                setOtp(code);
                setError('');
            } catch {
                setError('Invalid secret format');
                setOtp('');
            }
        } else if (secret) {
            setError('Invalid Base32 secret (min 16 characters, A-Z and 2-7 only)');
            setOtp('');
        } else {
            setOtp('');
            setError('');
        }
    }, [secret]);

    // Timer effect
    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = getTimeRemaining();
            const prog = getProgress();

            setTimeRemaining(remaining);
            setProgress(prog);

            // Regenerate OTP when timer resets
            if (remaining === 30) {
                updateOTP();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [updateOTP]);

    // Initial OTP generation
    useEffect(() => {
        updateOTP();
    }, [updateOTP]);

    const copyToClipboard = async (text: string, type: 'otp' | 'secret') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(null), 2000);
        } catch {
            console.error('Failed to copy');
        }
    };

    const clearAll = () => {
        setSecret('');
        setOtp('');
        setError('');
    };

    const formatOTP = (code: string) => {
        // Split into groups of 3 for readability
        if (code.length === 6) {
            return `${code.slice(0, 3)} ${code.slice(3)}`;
        }
        return code;
    };

    return (
        <>
            <style jsx>{`
                .authenticator-card {
                    max-width: 480px;
                    margin: 0 auto;
                    width: 100%;
                }
                .authenticator-header {
                    text-align: center;
                    margin-bottom: 24px;
                }
                @media (min-width: 640px) {
                    .authenticator-header {
                        margin-bottom: 32px;
                    }
                }
                .authenticator-icon {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--accent), var(--accent-hover));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 12px;
                }
                @media (min-width: 640px) {
                    .authenticator-icon {
                        width: 64px;
                        height: 64px;
                        margin-bottom: 16px;
                    }
                }
                .authenticator-title {
                    font-size: 1.25rem;
                    margin-bottom: 6px;
                    color: var(--text-primary);
                }
                @media (min-width: 640px) {
                    .authenticator-title {
                        font-size: 1.5rem;
                        margin-bottom: 8px;
                    }
                }
                .authenticator-subtitle {
                    color: var(--text-muted);
                    font-size: 0.75rem;
                    line-height: 1.4;
                }
                @media (min-width: 640px) {
                    .authenticator-subtitle {
                        font-size: 0.875rem;
                    }
                }
                .otp-display {
                    background: var(--bg-tertiary);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                @media (min-width: 640px) {
                    .otp-display {
                        padding: 24px;
                        margin-bottom: 24px;
                    }
                }
                .otp-code {
                    font-size: 2rem;
                    font-weight: bold;
                    font-family: monospace;
                    color: var(--accent);
                    letter-spacing: 0.15em;
                    margin-bottom: 12px;
                }
                @media (min-width: 640px) {
                    .otp-code {
                        font-size: 3rem;
                        letter-spacing: 0.2em;
                        margin-bottom: 16px;
                    }
                }
                .action-buttons {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 8px;
                }
                @media (min-width: 400px) {
                    .action-buttons {
                        grid-template-columns: 1fr 1fr;
                    }
                }
                @media (min-width: 500px) {
                    .action-buttons {
                        grid-template-columns: 1fr 1fr 1fr;
                    }
                }
                .action-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    padding: 10px 12px;
                    font-size: 0.8125rem;
                }
                @media (min-width: 640px) {
                    .action-btn {
                        padding: 12px 16px;
                        font-size: 0.875rem;
                        gap: 8px;
                    }
                }
                .security-note {
                    margin-top: 20px;
                    padding: 10px;
                    background: var(--bg-secondary);
                    border-radius: 8px;
                    font-size: 0.6875rem;
                    color: var(--text-muted);
                    text-align: center;
                    line-height: 1.4;
                }
                @media (min-width: 640px) {
                    .security-note {
                        margin-top: 24px;
                        padding: 12px;
                        font-size: 0.75rem;
                    }
                }
            `}</style>

            <div className="card authenticator-card">
                {/* Header */}
                <div className="authenticator-header">
                    <div className="authenticator-icon">
                        <Shield size={28} color="white" />
                    </div>
                    <h2 className="authenticator-title">
                        2FA Authenticator
                    </h2>
                    <p className="authenticator-subtitle">
                        Client-side TOTP generation<br />
                        Your secret never leaves your browser
                    </p>
                </div>

                {/* Secret Input */}
                <div className="input-group" style={{ marginBottom: 20 }}>
                    <label className="input-label">Secret Key (Base32)</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showSecret ? 'text' : 'password'}
                            className="input"
                            placeholder="Enter your Base32 secret..."
                            value={secret}
                            onChange={(e) => setSecret(e.target.value.toUpperCase())}
                            style={{ paddingRight: 48, fontFamily: 'monospace', fontSize: '0.875rem' }}
                            autoComplete="off"
                        />
                        <button
                            type="button"
                            onClick={() => setShowSecret(!showSecret)}
                            style={{
                                position: 'absolute',
                                right: 12,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: 4,
                            }}
                            title={showSecret ? 'Hide secret' : 'Show secret'}
                        >
                            {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {error && (
                        <p style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: 8 }}>
                            {error}
                        </p>
                    )}
                </div>

                {/* OTP Display */}
                {otp && (
                    <div className="otp-display">
                        <label style={{
                            display: 'block',
                            color: 'var(--text-muted)',
                            fontSize: '0.6875rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            marginBottom: 6
                        }}>
                            One-Time Password
                        </label>
                        <div className="otp-code">
                            {formatOTP(otp)}
                        </div>

                        {/* Timer */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 10 }}>
                            <Clock size={12} color="var(--text-muted)" />
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                                Refreshes in {timeRemaining}s
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div style={{
                            height: 4,
                            borderRadius: 2,
                            background: 'var(--bg-secondary)',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: progress > 20 ? 'var(--accent)' : 'var(--error)',
                                transition: 'width 0.1s linear, background 0.3s ease',
                                borderRadius: 2
                            }} />
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button
                        className="btn btn-primary action-btn"
                        onClick={() => copyToClipboard(otp, 'otp')}
                        disabled={!otp}
                    >
                        {copied === 'otp' ? <Check size={14} /> : <Copy size={14} />}
                        Copy OTP
                    </button>
                    <button
                        className="btn btn-secondary action-btn"
                        onClick={() => copyToClipboard(normalizeSecret(secret), 'secret')}
                        disabled={!secret || !isValidBase32(secret)}
                    >
                        {copied === 'secret' ? <Check size={14} /> : <Copy size={14} />}
                        Copy Secret
                    </button>
                    <button
                        className="btn btn-ghost action-btn"
                        onClick={clearAll}
                        disabled={!secret}
                    >
                        <Trash2 size={14} />
                        Clear
                    </button>
                </div>

                {/* Security Note */}
                <div className="security-note">
                    🔒 Your secret is processed entirely in your browser and is never sent to any server.
                </div>
            </div>
        </>
    );
}
