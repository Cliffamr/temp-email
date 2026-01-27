import prisma from '@/lib/db';
import { deleteDomain, addDomain } from '../actions';

export default async function DomainsPage() {
    const domains = await prisma.domain.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { inboxes: true } } }
    });

    return (
        <main>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Domains</h1>
            </div>

            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">Add New Domain</h2>
                <form action={addDomain} className="flex gap-4">
                    <input
                        type="text"
                        name="domain"
                        placeholder="example.com"
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Add</button>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Inboxes</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {domains.map((domain) => (
                            <tr key={domain.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{domain.domain}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{domain._count.inboxes}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{domain.createdAt.toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <form action={deleteDomain.bind(null, domain.id)}>
                                        <button type="submit" className="text-red-600 hover:text-red-900">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
