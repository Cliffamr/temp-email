import prisma from '@/lib/db';

export default async function DashboardPage() {
    const inboxCount = await prisma.inbox.count();
    const domainCount = await prisma.domain.count();
    const totalMessages = await prisma.message.count();

    const recentInboxes = await prisma.inbox.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { domain: true }
    });

    return (
        <main>
            <h1 className="mb-4 text-xl md:text-2xl">
                Dashboard Overview
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {/* Card 1 */}
                <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
                    <div className="flex p-4">
                        <h3 className="ml-2 text-sm font-medium">Total Inboxes</h3>
                    </div>
                    <p className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl">
                        {inboxCount}
                    </p>
                </div>
                {/* Card 2 */}
                <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
                    <div className="flex p-4">
                        <h3 className="ml-2 text-sm font-medium">Active Domains</h3>
                    </div>
                    <p className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl">
                        {domainCount}
                    </p>
                </div>
                {/* Card 3 */}
                <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
                    <div className="flex p-4">
                        <h3 className="ml-2 text-sm font-medium">Total Messages</h3>
                    </div>
                    <p className="truncate rounded-xl bg-white px-4 py-8 text-center text-2xl">
                        {totalMessages}
                    </p>
                </div>
            </div>

            <div className="mt-6">
                <h2 className="text-lg font-bold mb-4">Recent Inboxes</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentInboxes.map((inbox) => (
                                <tr key={inbox.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inbox.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inbox.createdAt.toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inbox.publicExpiresAt.toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
