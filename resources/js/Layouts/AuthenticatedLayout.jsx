import { usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import Sidebar from '@/Components/Sidebar';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, company } = usePage().props;

    const user = auth?.user;
    const branch = user?.branch;

    const [open, setOpen] = useState(false);

    const logout = (e) => {
        e.preventDefault();
        e.stopPropagation();

        router.post(route('logout'), {}, {
            preserveScroll: false,
            onBefore: () => setOpen(false),
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex min-h-screen">
                <Sidebar />

                <div className="flex flex-1 flex-col">
                    <nav className="relative z-40 flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
                        <div>
                            <div className="text-lg font-semibold text-gray-800">
                                {company?.company_name || 'POS System'}
                            </div>

                            <div className="text-xs text-gray-500">
                                Branch: {branch?.name || 'No Branch'}
                            </div>
                        </div>

                        <div className="relative">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setOpen((value) => !value);
                                }}
                                className="flex items-center gap-2 rounded px-3 py-2 text-sm hover:bg-gray-100"
                            >
                                <div className="text-right">
                                    <div className="font-medium text-gray-700">
                                        {user?.name || 'User'}
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        {branch?.name || 'No Branch'}
                                    </div>
                                </div>

                                <span className="text-gray-500">⌄</span>
                            </button>

                            {open && (
                                <div className="absolute right-0 top-full z-[9999] mt-2 w-56 rounded border bg-white shadow-lg">
                                    <div className="border-b px-4 py-3">
                                        <div className="text-sm font-medium text-gray-800">
                                            {user?.name || 'User'}
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            {user?.email || 'No email'}
                                        </div>

                                        <div className="mt-1 text-xs text-gray-400">
                                            Branch: {branch?.name || 'No Branch'}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="w-full cursor-pointer px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </nav>

                    {header && (
                        <header className="border-b bg-white px-6 py-4">
                            {header}
                        </header>
                    )}

                    <main className="flex-1 p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
