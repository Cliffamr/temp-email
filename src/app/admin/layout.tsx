import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const userRole = (session?.user as { role?: string } | undefined)?.role;

    // Only allow ADMIN users
    if (userRole !== 'ADMIN') {
        redirect('/');
    }

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-content">
                {children}
            </main>

            <style>{`
                .admin-layout {
                    display: flex;
                    min-height: 100vh;
                    background: var(--bg-primary);
                }

                .admin-content {
                    flex: 1;
                    padding: 40px;
                    overflow-y: auto;
                    width: 100%;
                }

                @media (max-width: 768px) {
                    .admin-content {
                        padding: 80px 20px 40px; /* Top padding for toggle button space */
                    }
                }
            `}</style>
        </div>
    );
}
