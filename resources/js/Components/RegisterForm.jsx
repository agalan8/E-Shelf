import { useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function RegisterForm({ onClose, onSwitchToLogin }) {
    const { data, setData, post, processing, errors: serverErrors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});

    const validate = (field, value) => {
        let newErrors = { ...errors };

        if (field === 'name') {
            if (!value) {
                newErrors.name = 'El nombre es obligatorio.';
            } else {
                delete newErrors.name;
            }
        }

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
            if (data.password_confirmation && value !== data.password_confirmation) {
                newErrors.password_confirmation = 'Las contraseñas no coinciden.';
            } else if (data.password_confirmation) {
                delete newErrors.password_confirmation;
            }
        }

        if (field === 'password_confirmation') {
            if (!value) {
                newErrors.password_confirmation = 'Confirma tu contraseña.';
            } else if (value !== data.password) {
                newErrors.password_confirmation = 'Las contraseñas no coinciden.';
            } else {
                delete newErrors.password_confirmation;
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

        validate('name', data.name);
        validate('email', data.email);
        validate('password', data.password);
        validate('password_confirmation', data.password_confirmation);

        if (Object.keys(errors).length === 0) {
            post(route('register'), {
                onSuccess: () => {
                    reset('password', 'password_confirmation');
                    onClose();
                },
            });
        }
    };

    return (
        <div className="w-full max-w-[480px] mx-auto">
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nombre" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name || serverErrors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => handleChange('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password || serverErrors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => handleChange('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation || serverErrors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex justify-center">
                    <PrimaryButton className="mt-4" disabled={processing}>
                        Registrarse
                    </PrimaryButton>
                </div>
            </form>
        </div>
    );
}
