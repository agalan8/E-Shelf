import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import TextAreaInput from '@/Components/TextAreaInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const { userEdit } = usePage().props;
    console.log('user', userEdit);
    const {socials} = usePage().props;

    // Mapea las redes sociales del usuario y obtiene los perfiles actuales
    const userSocials = userEdit.socials.reduce((acc, social) => {
        acc[social.nombre.toLowerCase()] = social.pivot.perfil;
        return acc;
    }, {});

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: userEdit.name,
            email: userEdit.email,
            biografia: userEdit.biografia,
            ...userSocials, // Carga las redes existentes
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <section className={className}>
            <header>
            <h3 className="text-lg font-medium text-white">Información del Perfil</h3>

            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Nombre */}
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email} />
                </div>

                {/* Biografía */}
                <div>
                    <InputLabel htmlFor="biografia" value="Biografía" />
                    <TextAreaInput
                        id="biografia"
                        className="mt-1 block w-full bg-[#272729] rounded-md text-white resize-none placeholder:text-[#68686e]" // "resize-none" previene el redimensionado
                        value={data.biografia || ''}
                        onChange={(e) => setData('biografia', e.target.value)}
                        placeholder="Escribe tu biografía aquí..."
                        rows={4}
                    />

                    <InputError className="mt-2" message={errors.biografia} />
                </div>

                {/* Redes Sociales - Generadas dinámicamente */}
                <div>
                    <h3 className="text-lg font-medium text-white">Redes Sociales</h3>
                    {socials.map((social) => (
                        <div key={social.id} className="mt-4">
                            <InputLabel htmlFor={social.nombre} value={social.nombre} />
                            <TextInput
                                id={social.nombre}
                                className="mt-1 block w-full"
                                value={data[social.nombre.toLowerCase()] || ''}
                                onChange={(e) =>
                                    setData(social.nombre.toLowerCase(), e.target.value)
                                }
                            />
                            <InputError className="mt-2" message={errors[social.nombre]} />
                        </div>
                    ))}
                </div>

                {/* Verificación de email */}
                {mustVerifyEmail && userEdit.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                {/* Botón Guardar */}
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Guardar</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Guardado correctamente</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
