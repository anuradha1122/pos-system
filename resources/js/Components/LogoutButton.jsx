import { useForm } from '@inertiajs/react';

export default function LogoutButton() {
    const { post } = useForm();

    return (
        <button
            onClick={() => post(route('logout'))}
            className="text-red-500"
        >
            Logout
        </button>
    );
}
