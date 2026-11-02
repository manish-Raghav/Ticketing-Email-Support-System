
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api, { getErrorMessage } from "../../services/api";

export default function VerifyOTP() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    const email = searchParams.get("email") || "";

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;

        setOtp(updatedOtp);
        setError("");
        setMessage("");

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();

        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pasted) return;

        const updatedOtp = Array(6).fill("");

        pasted.split("").forEach((digit, index) => {
            updatedOtp[index] = digit;
        });

        setOtp(updatedOtp);
        setError("");
        setMessage("");

        inputRefs.current[Math.min(pasted.length, 6) - 1]?.focus();
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Email is missing. Please register again.");
            return;
        }

        const otpValue = otp.join("");

        if (otpValue.length !== 6) {
            setError("Please enter the complete 6-digit OTP.");
            return;
        }

        setLoading(true);

        try {
            await api.post("/auth/verify-email", { email, otp: otpValue });

            setMessage("Email verified successfully!");

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1000);
        } catch (err) {
            setError(getErrorMessage(err, "Verification failed. Please try again."));
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
            <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid md:grid-cols-2">

                {/* Left panel */}
                <div className="hidden flex-col justify-between bg-indigo-700 p-10 text-white md:flex">
                    <div>
                        <div className="mb-12 flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl font-bold">
                                S
                            </div>
                            <span className="text-xl font-bold">SupportDesk</span>
                        </div>

                        <h1 className="text-4xl font-bold leading-tight">
                            Verify your email.
                        </h1>

                        <p className="mt-5 leading-7 text-indigo-100">
                            One quick step to secure your account.
                            Verify your email address to continue.
                        </p>
                    </div>

                    <p className="text-sm text-indigo-200">
                        Your security matters to us.
                    </p>
                </div>

                {/* OTP form */}
                <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
                    <div className="mb-8">
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.7}
                                stroke="currentColor"
                                className="h-7 w-7"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 7.5 10.2 12.3a3.2 3.2 0 0 0 3.6 0L21 7.5M5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 17.25V6.75A2.25 2.25 0 0 1 5.25 4.5Z"
                                />
                            </svg>
                        </div>

                        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
                            Email verification
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-slate-900">
                            Verify OTP
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            Enter the 6-digit code sent to{" "}
                            <span className="font-medium text-slate-700">
                                {email || "your registered email"}
                            </span>
                            .
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="flex justify-between gap-2 sm:gap-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete={index === 0 ? "one-time-code" : "off"}
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    aria-label={`OTP digit ${index + 1}`}
                                    value={digit}
                                    onChange={(e) =>
                                        handleChange(e.target.value, index)
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onPaste={handlePaste}
                                    required
                                    className="h-12 min-w-0 w-full rounded-lg border border-slate-300 text-center text-xl font-bold outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:h-14"
                                />
                            ))}
                        </div>

                        {error && (
                            <p
                                role="alert"
                                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                            >
                                {error}
                            </p>
                        )}

                        {message && (
                            <p
                                role="status"
                                className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
                            >
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || Boolean(message)}
                            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Verifying..." : "Verify Email"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs leading-5 text-slate-500">
                        The verification code expires after five minutes. If the code expires, register again to request a fresh verification code.
                    </p>

                    <p className="mt-7 text-center text-sm text-slate-600">
                        Already verified?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
