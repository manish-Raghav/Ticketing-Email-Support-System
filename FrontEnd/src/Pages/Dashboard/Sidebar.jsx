
import { NavLink } from "react-router-dom";
import { Headset, LogOut, X } from "lucide-react";
import { dashboardNavigation } from "../../config/dashboardNavigation";

const Sidebar = ({
    role = "customer",
    open = false,
    setOpen = () => { },
    onLogout = () => { },
}) => {
    const navigation = dashboardNavigation[role] || [];

    const roleTitles = {
        customer: "Customer Portal",
        support_agent: "Support Agent",
        admin: "Administration",
    };

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          border-r border-gray-200 bg-white
          transition-transform duration-300
          lg:static lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                {/* Logo */}
                <div className="flex h-20 items-center justify-between border-b px-5">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-600 p-2 text-white">
                            <Headset size={23} />
                        </div>

                        <div>
                            <h2 className="font-bold text-gray-900">
                                SupportDesk
                            </h2>
                            <p className="text-xs text-gray-500">
                                {roleTitles[role] || "Dashboard"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                    {navigation.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `
                    flex items-center gap-3 rounded-lg px-4 py-3
                    text-sm font-medium transition
                    ${isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    }
                  `
                                }
                            >
                                <Icon size={19} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="border-t p-4">
                    <button
                        type="button"
                        onClick={onLogout}
                        className="flex w-full items-center gap-3 rounded-lg
            px-4 py-3 text-sm font-medium text-red-600
            transition hover:bg-red-50"
                    >
                        <LogOut size={19} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
