import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex min-h-screen">
                <Sidebar />

                <div className="flex flex-1 flex-col">
                    <nav className="border-b border-gray-200 bg-white px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="font-medium text-gray-800">POS System</div>
                            <div className="text-sm text-gray-600">{user?.name}</div>
                        </div>
                    </nav>

                    {header && (
                        <header className="border-b border-gray-200 bg-white">
                            <div className="px-6 py-4">{header}</div>
                        </header>
                    )}

                    <main className="p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
