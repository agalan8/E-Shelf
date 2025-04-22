export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-white text-[#a32bff] shadow-sm focus:ring-white ' +
                className
            }
        />
    );
}
