import { signOut } from '@/auth';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64 bg-gray-900 text-white p-6">
                <div className="flex flex-col h-full justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
                        <nav className="space-y-2">
                            <a href="/admin/dashboard" className="block py-2 px-4 rounded hover:bg-gray-800">Dashboard</a>
                            <a href="/admin/inboxes" className="block py-2 px-4 rounded hover:bg-gray-800">Inboxes</a>
                            <a href="/admin/domains" className="block py-2 px-4 rounded hover:bg-gray-800">Domains</a>
                        </nav>
                    </div>
                    <form
                        action={async () => {
                            'use server';
                            await signOut();
                        }}
                    >
                        <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-800 p-3 text-sm font-medium hover:bg-gray-700 hover:text-white md:flex-none md:justify-start md:p-2 md:px-3">
                            <div className="hidden md:block">Sign Out</div>
                        </button>
                    </form>
                </div>
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}
