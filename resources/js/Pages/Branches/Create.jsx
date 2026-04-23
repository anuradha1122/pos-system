import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import BranchForm from './Form';

export default function Create() {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Create Branch</h2>}
        >
            <Head title="Create Branch" />

            <div className="py-6">
                <div className="mx-auto max-w-4xl space-y-6 sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">New Branch</h3>
                            <Link
                                href={route('branches.index')}
                                className="rounded-lg border px-4 py-2 text-sm"
                            >
                                Back
                            </Link>
                        </div>

                        <BranchForm onSubmitLabel="Create Branch" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
