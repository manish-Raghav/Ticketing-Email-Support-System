
import { LoaderCircle } from "lucide-react";

const Loader = ({
    size = "md",
    text = "Loading...",
    fullScreen = false,
    className = "",
}) => {
    const sizes = {
        sm: 18,
        md: 28,
        lg: 40,
        xl: 56,
    };

    const content = (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <LoaderCircle
                size={sizes[size] || sizes.md}
                className="animate-spin text-blue-600"
            />

            {text && (
                <p className="text-sm font-medium text-gray-600">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90">
                {content}
            </div>
        );
    }

    return content;
};

export default Loader;
