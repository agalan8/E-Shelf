import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center justify-center px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                ' ' + className
            }
        >
            <div
                className={
                    (active
                        ? 'bg-[#7A27BC] '
                        : 'hover:bg-[#2A2D2F] ') +
                    'rounded-xl p-2 transition-colors duration-200'
                }
            >
                {children}
            </div>
        </Link>
    );
}
