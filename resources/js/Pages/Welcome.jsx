import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth, company } = usePage().props;

    const user = auth?.user;
    const logoUrl = company?.logo ? `/storage/${company.logo}` : null;

    return (
        <>
            <Head title="Welcome" />

            <div className="min-h-screen bg-gray-100">
                <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt="Company Logo"
                                    className="h-12 w-12 rounded object-contain"
                                />
                            ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded bg-slate-900 text-lg font-bold text-white">
                                    {company?.company_name?.charAt(0) || 'P'}
                                </div>
                            )}

                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {company?.company_name || 'POS System'}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    Sales • Inventory • Payments • Reports
                                </p>
                            </div>
                        </div>

                        <div>
                            {user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={route('login')}
                                    className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </nav>

                    <main className="flex flex-1 items-center">
                        <div className="grid w-full gap-8 md:grid-cols-2">
                            <div className="flex flex-col justify-center">
                                <div className="mb-5 flex items-center gap-4">
                                    {logoUrl ? (
                                        <img
                                            src={logoUrl}
                                            alt="Company Logo"
                                            className="h-20 w-20 object-contain"
                                        />
                                    ) : (
                                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-3xl font-bold text-white shadow">
                                            {company?.company_name?.charAt(0) || 'P'}
                                        </div>
                                    )}

                                    <div>
                                        <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                                            {company?.company_name || 'POS System'}
                                        </h2>
                                        <p className="mt-1 text-sm font-medium text-gray-500">
                                            Smart Business Management
                                        </p>
                                    </div>
                                </div>

                                <p className="text-lg text-gray-600">
                                    Manage sales, purchases, stock, payments, expenses,
                                    reports, statements, and daily closing from one place.
                                </p>

                                <div className="mt-6 flex gap-3">
                                    {user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="rounded bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
                                        >
                                            Go to Dashboard
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('login')}
                                            className="rounded bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-700"
                                        >
                                            Login to System
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white p-6 shadow">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                    System Modules
                                </h3>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {[
                                        'Sales',
                                        'Purchases',
                                        'Inventory',
                                        'Payments',
                                        'Expenses',
                                        'Reports',
                                        'Statements',
                                        'Daily Closing',
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="rounded border bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700"
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </main>

                    <footer className="border-t py-4 text-center text-xs text-gray-500">
                        © {new Date().getFullYear()} {company?.company_name || 'POS System'}.
                        All rights reserved.
                    </footer>
                </div>
            </div>
        </>
    );
}
