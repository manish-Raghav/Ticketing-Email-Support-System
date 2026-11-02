
const StatusBadge = ({ status, className = "" }) => {
    const statusStyles = {
        open: "bg-blue-100 text-blue-700",
        pending: "bg-yellow-100 text-yellow-700",
        in_progress: "bg-purple-100 text-purple-700",
        resolved: "bg-green-100 text-green-700",
        closed: "bg-gray-100 text-gray-700",
        reopened: "bg-orange-100 text-orange-700",
        waiting_for_customer: "bg-amber-100 text-amber-700",
        waiting_for_agent: "bg-indigo-100 text-indigo-700",
    };

    const statusLabels = {
        in_progress: "In Progress",
        waiting_for_customer: "Waiting for Customer",
        waiting_for_agent: "Waiting for Agent",
    };

    const normalizedStatus = String(status || "")
        .toLowerCase()
        .trim()
        .replaceAll(" ", "_")
        .replaceAll("-", "_");

    const label =
        statusLabels[normalizedStatus] ||
        normalizedStatus
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ") ||
        "Unknown";

    return (
        <span
            className={`
        inline-flex items-center rounded-full px-3 py-1
        text-xs font-semibold whitespace-nowrap
        ${statusStyles[normalizedStatus] || "bg-gray-100 text-gray-600"}
        ${className}
      `}
        >
            {label}
        </span>
    );
};

export default StatusBadge;
