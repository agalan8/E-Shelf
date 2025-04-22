import { useForm } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link } from '@inertiajs/react';

export default function LoginForm({
    onClose,
    onSwitchToRegister,
    onSwitchToForgotPassword,
    status,
    canResetPassword
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="w-full max-w-[480px] mx-auto">
            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-[#eceeef]">Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onSwitchToForgotPassword();
                            }}
                            className="text-sm text-[#a42bfd] underline hover:text-[#8222cc] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                <div className="flex justify-center">
                    <PrimaryButton className="mt-4" disabled={processing}>
                        Iniciar sesión
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
