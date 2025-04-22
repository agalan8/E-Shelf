export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center w-full rounded-md border border-transparent bg-[#a32bff] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-[#9326E6] focus:bg-[#9326E6] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 active:bg-[#9326E6] ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
