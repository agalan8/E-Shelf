import { useForm } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function LoginForm({
    onClose,
    onSwitchToRegister,
    onSwitchToForgotPassword,
    status,
    canResetPassword
}) {
    const { data, setData, post, processing, errors: serverErrors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [errors, setErrors] = useState({});

    const validate = (field, value) => {
        let newErrors = { ...errors };

        if (field === 'email') {
            if (!value) {
                newErrors.email = 'El email es obligatorio.';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                newErrors.email = 'Introduce un email válido.';
            } else {
                delete newErrors.email;
            }
        }

        if (field === 'password') {
            if (!value) {
                newErrors.password = 'La contraseña es obligatoria.';
            } else if (value.length < 8) {
                newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
            } else {
                delete newErrors.password;
            }
        }

        setErrors(newErrors);
    };

    const handleChange = (field, value) => {
        setData(field, value);
        validate(field, value);
    };

    const submit = (e) => {
        e.preventDefault();

        validate('email', data.email);
        validate('password', data.password);

        if (Object.keys(errors).length === 0) {
            post(route('login'), {
                onFinish: () => reset('password'),
            });
        }
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
                        onChange={(e) => handleChange('email', e.target.value)}
                    />
                    <InputError message={errors.email || serverErrors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Contraseña" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => handleChange('password', e.target.value)}
                    />
                    <InputError message={errors.password || serverErrors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ml-2 text-sm text-[#eceeef]">Recuérdame</span>
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
                            ¿Has olvidado la contraseña?
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
