
const StatCard = ({
    title,
    value = 0,
    description,
    icon: Icon,
    color = "blue",
    trend,
}) => {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        orange: "bg-orange-50 text-orange-600",
        purple: "bg-purple-50 text-purple-600",
        red: "bg-red-50 text-red-600",
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white
    p-5 shadow-sm transition hover:shadow-md">

            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>

                    <h2 className="mt-3 text-2xl font-bold text-gray-900">
                        {value}
                    </h2>
                </div>

                {Icon && (
                    <div className={`rounded-xl p-3 ${colors[color] || colors.blue}`}>
                        <Icon size={22} />
                    </div>
                )}
            </div>

            {(description || trend) && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {trend && (
                        <span className={`text-xs font-semibold ${trend.direction === "down"
                            ? "text-red-600"
                            : "text-green-600"
                            }`}>
                            {trend.value}
                        </span>
                    )}

                    {description && (
                        <p className="text-xs text-gray-500">
                            {description}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default StatCard;
