
const PriorityBadge = ({ priority, className = "" }) => {
    const priorityStyles = {
        low: "bg-green-100 text-green-700",
        medium: "bg-yellow-100 text-yellow-700",
        high: "bg-orange-100 text-orange-700",
        urgent: "bg-red-100 text-red-700",
    };

    const normalizedPriority = String(priority || "")
        .toLowerCase()
        .trim();

    const label = normalizedPriority
        ? normalizedPriority.charAt(0).toUpperCase() +
        normalizedPriority.slice(1)
        : "Not Set";

    return (
        <span
            className={`
        inline-flex items-center rounded-full px-3 py-1
        text-xs font-semibold whitespace-nowrap
        ${priorityStyles[normalizedPriority] || "bg-gray-100 text-gray-600"}
        ${className}
      `}
        >
            {label}
        </span>
    );
};

export default PriorityBadge;
