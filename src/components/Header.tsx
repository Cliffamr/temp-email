'use client';

import Link from 'next/link';
import { Mail, Settings, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
    const { data: session } = useSession();
    const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'ADMIN';

    return (
        <header className="header">
            <div className="container header-content">
                <Link href="/" className="logo">
                    <div className="logo-icon"><Mail size={24} /></div>
                    <span>TempMail</span>
                </Link>
                <nav className="nav-links">
                    <Link href="/" className="btn btn-ghost">
                        Create Inbox
                    </Link>
                    <Link href="/restore" className="btn btn-ghost">
                        Restore Inbox
                    </Link>
                    {isAdmin && (
                        <Link href="/admin/dashboard" className="btn btn-ghost" style={{ color: 'var(--accent)' }}>
                            <Settings size={16} style={{ marginRight: '4px' }} />
                            Admin
                        </Link>
                    )}
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="btn btn-ghost"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <LogOut size={16} style={{ marginRight: '4px' }} />
                        Logout
                    </button>
                </nav>
            </div>
        </header>
    );
}
