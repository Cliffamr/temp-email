'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, Users, Inbox, Globe, LogOut, ArrowLeft, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const isActive = (path: string) => pathname === path;

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="admin-sidebar-toggle"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
            >
                <Menu size={24} />
            </button>

            {/* Sidebar Overlay (Mobile) */}
            {isOpen && (
                <div
                    className="admin-sidebar-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link href="/" className="back-link">
                        <ArrowLeft size={16} />
                        <span>Back to App</span>
                    </Link>
                    <h2>Admin Panel</h2>
                    <button
                        className="close-sidebar-btn"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <Link
                        href="/admin/dashboard"
                        className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href="/admin/users"
                        className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}
                    >
                        <Users size={20} />
                        <span>Users</span>
                    </Link>
                    <Link
                        href="/admin/inboxes"
                        className={`nav-item ${isActive('/admin/inboxes') ? 'active' : ''}`}
                    >
                        <Inbox size={20} />
                        <span>Inboxes</span>
                    </Link>
                    <Link
                        href="/admin/domains"
                        className={`nav-item ${isActive('/admin/domains') ? 'active' : ''}`}
                    >
                        <Globe size={20} />
                        <span>Domains</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="btn btn-secondary logout-btn"
                    >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            <style jsx>{`
                .admin-sidebar-toggle {
                    display: none;
                    position: fixed;
                    top: 16px;
                    left: 16px;
                    z-index: 50;
                    padding: 8px;
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    color: var(--text-primary);
                    cursor: pointer;
                }

                .admin-sidebar {
                    width: 250px;
                    background: var(--bg-tertiary);
                    border-right: 1px solid var(--border-color);
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    position: sticky;
                    top: 0;
                    padding: 24px;
                    transition: transform 0.3s ease;
                    z-index: 100;
                }

                .sidebar-header {
                    margin-bottom: 32px;
                }

                .back-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--accent-primary);
                    font-size: 0.875rem;
                    margin-bottom: 16px;
                    text-decoration: none;
                }

                .back-link:hover {
                    text-decoration: underline;
                }

                .sidebar-header h2 {
                    font-size: 1.25rem;
                    color: var(--text-primary);
                    margin: 0;
                }

                .close-sidebar-btn {
                    display: none;
                    position: absolute;
                    top: 24px;
                    right: 24px;
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                }

                .sidebar-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    flex: 1;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    border-radius: var(--radius-md);
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .nav-item:hover {
                    background: var(--bg-elevated);
                    color: var(--text-primary);
                }

                .nav-item.active {
                    background: var(--accent-primary);
                    color: white;
                }

                .logout-btn {
                    width: 100%;
                    gap: 8px;
                }

                @media (max-width: 768px) {
                    .admin-sidebar-toggle {
                        display: block;
                    }

                    .admin-sidebar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        transform: translateX(-100%);
                        box-shadow: var(--shadow-lg);
                    }

                    .admin-sidebar.open {
                        transform: translateX(0);
                    }

                    .close-sidebar-btn {
                        display: block;
                    }

                    .admin-sidebar-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.5);
                        backdrop-filter: blur(4px);
                        z-index: 90;
                    }
                }
            `}</style>
        </>
    );
}
