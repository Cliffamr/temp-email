import prisma from '@/lib/db';
import { deleteInbox } from '../actions';

export default async function InboxesPage() {
    const inboxes = await prisma.inbox.findMany({
        orderBy: { createdAt: 'desc' },
        include: { domain: true }
    });

    return (
        <main>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Inboxes</h1>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Access</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {inboxes.map((inbox) => (
                            <tr key={inbox.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inbox.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inbox.createdAt.toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inbox.lastAccessAt.toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <form action={deleteInbox.bind(null, inbox.id)}>
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
