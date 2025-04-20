import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import { Head, useForm, Link } from '@inertiajs/react';

export default function ForgotPasswordForm({ onClose, onSwitchToLogin }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <div className="px-6 py-4 w-full max-w-sm mx-auto bg-[#18191C] rounded-lg">
            <Head title="Forgot Password" />

            <h2 className="mb-6 text-xl text-white font-semibold text-center">
                Forgot Password
            </h2>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                {/* Input para el email */}
                <div className="mb-4">
                    <InputLabel htmlFor="email" value="Enter email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full px-4 py-2 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    {/* Error del input */}
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="flex justify-center mt-6">
                    <PrimaryButton
                        className="w-full py-2  text-sm font-medium rounded-full transition-all duration-300 ease-in-out"
                        disabled={processing}
                    >
                        Send Password Reset Link
                    </PrimaryButton>
                </div>



            </form>

            <div className="mt-6 text-sm text-center">
                <Link
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onSwitchToLogin();  // Volver a la vista de Login
                    }}
                    className="text-sm text-[#a42bfd] underline hover:text-[#8222cc] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                >
                    ← Ir a Iniciar sesión
                </Link>
            </div>
        </div>
    );
}
