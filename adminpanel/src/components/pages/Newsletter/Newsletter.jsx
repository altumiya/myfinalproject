import { FaFilter, FaPowerOff, FaTrash } from 'react-icons/fa';

export default function Newsletter() {
    const subscribers = [
        { id: 1, email: 'amit@example.com', date: '2026-05-20', source: 'Footer Form', status: 'Active' },
        { id: 2, email: 'priya@example.com', date: '2026-05-22', source: 'Contact Page', status: 'Active' },
        { id: 3, email: 'rahul@example.com', date: '2026-05-25', source: 'Popup Form', status: 'Inactive' },
        { id: 4, email: 'neha@example.com', date: '2026-05-28', source: 'Footer Form', status: 'Active' },
    ];

    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Newsletter</h2>
                </div>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <FaFilter />
                    Filter
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead className="bg-gray-50 uppercase text-gray-500">
                        <tr>
                            <th scope="col" className="px-6 py-4">ID</th>
                            <th scope="col" className="px-6 py-4">Email</th>
                            <th scope="col" className="px-6 py-4">Subscribe Date</th>
                            <th scope="col" className="px-6 py-4">Source</th>
                            <th scope="col" className="px-6 py-4">Status</th>
                            <th scope="col" className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscribers.map((subscriber) => (
                            <tr key={subscriber.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-6 py-4">{subscriber.id}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">{subscriber.email}</td>
                                <td className="px-6 py-4 text-gray-600">{subscriber.date}</td>
                                <td className="px-6 py-4 text-gray-700">{subscriber.source}</td>
                                <td className="px-6 py-4">
                                    <span className={`rounded px-2 py-1 text-xs font-semibold ${
                                        subscriber.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {subscriber.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-md bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-200"
                                        >
                                            <FaPowerOff />
                                            Change Status
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-md bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-200"
                                        >
                                            <FaTrash />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
