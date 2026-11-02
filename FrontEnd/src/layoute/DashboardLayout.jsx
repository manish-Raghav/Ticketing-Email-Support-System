
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Pages/Dashboard/Sidebar";
import Header from "../Pages/Dashboard/Header";


const DashboardLayout = ({ role }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useNavigate();

    // Get logged-in user
    let user = null;
    try { user = JSON.parse(localStorage.getItem("user") || "null"); } catch { localStorage.removeItem("user"); }

    // Dashboard page titles
    const dashboardTitles = {
        customer: "Customer Dashboard",
        support_agent: "Agent Dashboard",
        admin: "Admin Dashboard",
    };

    // Role validation for layout
    if (!["customer", "support_agent", "admin"].includes(role)) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg font-semibold text-red-600">
                    Invalid dashboard role.
                </p>
            </div>
        );
    }

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // If your backend uses refresh-token cookies,
        // call your logout API here to invalidate the refresh token.
        navigate("/login", { replace: true });
    };

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Sidebar */}
            <Sidebar
                role={role}
                open={sidebarOpen}
                setOpen={setSidebarOpen}
                onLogout={handleLogout}
            />

            {/* Main dashboard section */}
            <div className="flex min-w-0 flex-1 flex-col">

                {/* Header */}
                <Header
                    title={dashboardTitles[role]}
                    user={user}
                    onMenuClick={() => setSidebarOpen(true)}
                    onLogout={handleLogout}
                />

                {/* Page content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white px-6 py-4">
                    <p className="text-center text-xs text-gray-500">
                        © {new Date().getFullYear()} SupportDesk. All rights reserved.
                    </p>
                </footer>

            </div>
        </div>
    );
};

export default DashboardLayout;
