
import { Loader2 } from "lucide-react";

const Button = ({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    fullWidth = false,
    onClick,
    className = "",
    ...props
}) => {
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
    };

    const sizes = {
        sm: "px-3 py-2 text-xs",
        md: "px-4 py-2.5 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
        inline-flex items-center justify-center gap-2 rounded-lg
        font-semibold transition duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
            {...props}
        >
            {loading && <Loader2 size={17} className="animate-spin" />}
            {children}
        </button>
    );
};

export default Button;
