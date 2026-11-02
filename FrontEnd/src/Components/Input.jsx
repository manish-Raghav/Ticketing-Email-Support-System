
import { useId } from "react";

const Input = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder = "",
    error,
    helperText,
    required = false,
    disabled = false,
    className = "",
    ...props
}) => {
    const generatedId = useId();
    const inputId = props.id || generatedId;

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <input
                id={inputId}
                name={name}
                type={type}
                value={value ?? ""}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                aria-invalid={Boolean(error)}
                aria-describedby={error || helperText ? `${inputId}-message` : undefined}
                className={`
          w-full rounded-lg border bg-white px-4 py-2.5 text-sm
          text-gray-800 outline-none transition
          placeholder:text-gray-400
          focus:ring-2 focus:ring-blue-100
          disabled:cursor-not-allowed disabled:bg-gray-100
          ${error
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }
          ${className}
        `}
                {...props}
            />

            {error && (
                <p id={`${inputId}-message`} className="text-xs text-red-600">
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p id={`${inputId}-message`} className="text-xs text-gray-500">
                    {helperText}
                </p>
            )}
        </div>
    );
};

export default Input;
