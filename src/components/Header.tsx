'use client';

import Link from 'next/link';
import { Mail, Settings, LogOut, Shield, Menu, X, LogIn } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Header() {
    const { data: session } = useSession();
    const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'ADMIN';
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="header">
            <div className="container header-content">
                <Link href="/" className="logo">
                    <div className="logo-icon"><Mail size={24} /></div>
                    <span>TempMail</span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Nav */}
                <nav className="nav-links desktop-nav">
                    <Link href="/" className="btn btn-ghost">
                        Create Inbox
                    </Link>
                    <Link href="/restore" className="btn btn-ghost">
                        Restore Inbox
                    </Link>
                    <Link href="/tools/2fa" className="btn btn-ghost">
                        <Shield size={16} style={{ marginRight: '4px' }} />
                        2FA Tool
                    </Link>
                    {isAdmin && (
                        <Link href="/admin/dashboard" className="btn btn-ghost" style={{ color: 'var(--accent)' }}>
                            <Settings size={16} style={{ marginRight: '4px' }} />
                            Admin
                        </Link>
                    )}
                    {session ? (
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="btn btn-ghost"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            <LogOut size={16} style={{ marginRight: '4px' }} />
                            Logout
                        </button>
                    ) : (
                        <Link href="/login" className="btn btn-ghost" style={{ color: 'var(--text-secondary)' }}>
                            <LogIn size={16} style={{ marginRight: '4px' }} />
                            Login
                        </Link>
                    )}
                </nav>

                {/* Mobile Nav Overlay */}
                {isMenuOpen && (
                    <div className="mobile-nav-overlay">
                        <nav className="mobile-nav">
                            <Link href="/" className="btn btn-ghost mobile-nav-item" onClick={toggleMenu}>
                                Create Inbox
                            </Link>
                            <Link href="/restore" className="btn btn-ghost mobile-nav-item" onClick={toggleMenu}>
                                Restore Inbox
                            </Link>
                            <Link href="/tools/2fa" className="btn btn-ghost mobile-nav-item" onClick={toggleMenu}>
                                <Shield size={16} style={{ marginRight: '4px' }} />
                                2FA Tool
                            </Link>
                            {isAdmin && (
                                <Link href="/admin/dashboard" className="btn btn-ghost mobile-nav-item" style={{ color: 'var(--accent)' }} onClick={toggleMenu}>
                                    <Settings size={16} style={{ marginRight: '4px' }} />
                                    Admin
                                </Link>
                            )}
                            {session ? (
                                <button
                                    onClick={() => {
                                        toggleMenu();
                                        signOut({ callbackUrl: '/login' });
                                    }}
                                    className="btn btn-ghost mobile-nav-item"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    <LogOut size={16} style={{ marginRight: '4px' }} />
                                    Logout
                                </button>
                            ) : (
                                <Link href="/login" className="btn btn-ghost mobile-nav-item" style={{ color: 'var(--text-secondary)' }} onClick={toggleMenu}>
                                    <LogIn size={16} style={{ marginRight: '4px' }} />
                                    Login
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </div>

            <style jsx>{`
                .mobile-menu-btn {
                    display: none;
                    background: none;
                    border: none;
                    color: var(--text-primary);
                    cursor: pointer;
                    padding: 8px;
                }

                .mobile-nav-overlay {
                    display: none;
                }

                @media (max-width: 768px) {
                    .mobile-menu-btn {
                        display: block;
                    }

                    .desktop-nav {
                        display: none;
                    }

                    .header-content {
                        position: relative;
                    }

                    .mobile-nav-overlay {
                        display: block;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: var(--bg-secondary);
                        border-bottom: 1px solid var(--border-color);
                        padding: 16px;
                        box-shadow: var(--shadow-lg);
                        animation: slideDown 0.2s ease-out;
                        z-index: 1000;
                    }

                    .mobile-nav {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }

                    .mobile-nav-item {
                        justify-content: flex-start;
                        width: 100%;
                        padding: 12px;
                    }

                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                }
            `}</style>
        </header>
    );
}
