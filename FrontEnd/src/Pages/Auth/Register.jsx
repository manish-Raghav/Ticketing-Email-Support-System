
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../../services/api";

const initialForm = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
};

const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
        setMessage("");
    };

    const validate = () => {
        const newErrors = {};

        if (form.name.trim().length < 2) {
            newErrors.name = "Name must contain at least 2 characters.";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            newErrors.email = "Enter a valid email address.";
        }

        // Accepts 10-digit Indian mobile numbers, optionally with +91.
        const phone = form.phone.replace(/[\s-]/g, "");
        if (!/^(?:\+91)?[6-9]\d{9}$/.test(phone)) {
            newErrors.phone = "Enter a valid Indian mobile number.";
        }

        if (form.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters.";
        } else if (
            !/[A-Z]/.test(form.password) ||
            !/[a-z]/.test(form.password) ||
            !/\d/.test(form.password)
        ) {
            newErrors.password =
                "Use uppercase, lowercase, and at least one number.";
        }

        if (form.confirmPassword !== form.password) {
            newErrors.confirmPassword = "Passwords do not match.";
        }

        if (!["customer", "support_agent"].includes(form.role)) {
            newErrors.role = "Please select a valid role.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!validate()) return;

        setLoading(true);

        try {
            const { confirmPassword, ...formData } = form;

            const response = await api.post(
                "/auth/register",
                {
                    ...formData,
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    phone: formData.phone.replace(/[\s-]/g, ""),
                }
            );

            setMessage(response.data.message || "Registration successful.");

            // Continue to the registration email OTP verification page.
            navigate(
                `/verify-otp?email=${encodeURIComponent(formData.email.trim().toLowerCase())}`,
                { replace: true }
            );
        } catch (error) {
            setMessage(
                getErrorMessage(error, "Registration failed. Please try again.")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
            <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
                <div className="mb-7 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Create Account
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Join the SupportDesk platform
                    </p>
                </div>

                {message && (
                    <div
                        role="alert"
                        className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700"
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div>
                        <label htmlFor="name" className="mb-1 block text-sm font-medium">
                            Full name
                        </label>
                        <input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            className={inputClass}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            className={inputClass}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="phone" className="mb-1 block text-sm font-medium">
                            Phone number
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="9876543210"
                            autoComplete="tel"
                            className={inputClass}
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Create a strong password"
                            autoComplete="new-password"
                            className={inputClass}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-1 block text-sm font-medium"
                        >
                            Confirm password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Enter your password again"
                            autoComplete="new-password"
                            className={inputClass}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                            className="h-4 w-4 rounded"
                        />
                        Show passwords
                    </label>

                    <div>
                        <label htmlFor="role" className="mb-1 block text-sm font-medium">
                            Register as
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="customer">Customer</option>
                            <option value="support_agent">Support Agent</option>
                        </select>

                        {errors.role && (
                            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                        )}

                        <p className="mt-1 text-xs text-gray-500">
                            Admin accounts are created separately by an administrator.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
