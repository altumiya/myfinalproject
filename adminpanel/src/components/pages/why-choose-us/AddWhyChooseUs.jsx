export default function AddWhyChooseUs() {
    return (
        <div className="max-w-3xl rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Why Choose Us</h2>
            </div>

            <form className="grid gap-6 md:grid-cols-2">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Title</label>
                    <input
                        type="text"
                        placeholder="e.g. Expert Support"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Icon Class</label>
                    <input
                        type="text"
                        placeholder="e.g. fa-headset"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Display Order</label>
                    <input
                        type="number"
                        placeholder="1"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Status</label>
                    <select className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500">
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-900">Description</label>
                    <textarea
                        rows="4"
                        placeholder="Enter short description"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="md:col-span-2">
                    <button
                        type="button"
                        className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
