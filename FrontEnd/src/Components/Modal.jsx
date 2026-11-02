
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = "md",
    closeOnOutsideClick = true,
    showCloseButton = true,
}) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose?.();
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center
      overflow-y-auto bg-black/50 p-4"
            onMouseDown={(event) => {
                if (
                    closeOnOutsideClick &&
                    event.target === event.currentTarget
                ) {
                    onClose?.();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className={`w-full ${sizes[size] || sizes.md}
        overflow-hidden rounded-xl bg-white shadow-xl`}
            >
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between border-b
          border-gray-200 px-5 py-4">
                        <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
                            {title}
                        </h2>

                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}

                <div className="max-h-[70vh] overflow-y-auto p-5">
                    {children}
                </div>

                {footer && (
                    <div className="flex flex-wrap justify-end gap-3 border-t
          border-gray-200 px-5 py-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
