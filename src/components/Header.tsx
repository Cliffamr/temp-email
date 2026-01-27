'use client';

import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function Header() {
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
                </nav>
            </div>
        </header>
    );
}
