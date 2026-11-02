// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { LifeBuoy, Mail, Lock, Eye, EyeOff, ShieldCheck, Headphones, CheckCircle } from "lucide-react";
// import api, { getErrorMessage } from "../../services/api";

// const inputClass = "w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
// const dashboardRoutes = { customer: "/customer/dashboard", support_agent: "/agent/dashboard", admin: "/admin/dashboard" };

// export default function Login() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setMessage("");
//     setLoading(true);
//     try {
//       const { data } = await api.post("/auth/login", {
//         email: form.email.trim().toLowerCase(),
//         password: form.password,
//       });
//       const user = data.data?.user;
//       const token = data.data?.token;
//       const destination = dashboardRoutes[user?.role];
//       if (!user || !token || !destination) throw new Error("The server returned an incomplete login response.");
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       navigate(destination, { replace: true });
//     } catch (error) {
//       setMessage(getErrorMessage(error, "Login failed. Please check your credentials."));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">
//       <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
//         <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border-[50px] border-white/5" />
//         <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full border-[50px] border-white/5" />
//         <Link to="/" className="relative z-10 flex items-center gap-3"><div className="rounded-xl bg-white/15 p-3"><LifeBuoy size={30}/></div><div><h1 className="text-2xl font-bold">SupportDesk</h1><p className="text-xs text-blue-200">Customer Support Portal</p></div></Link>
//         <div className="relative z-10 max-w-lg"><span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold">YOUR SUPPORT PARTNER</span><h2 className="mt-8 text-5xl font-bold leading-tight">We're here to<span className="block text-blue-300">make things easier.</span></h2><p className="mt-6 text-lg leading-8 text-blue-100">Get help, track your requests, and communicate with our support team through one simple platform.</p><div className="mt-10 space-y-5">{["Create and track support tickets", "Communicate directly with support agents", "Review ticket progress and updates"].map(item=><div key={item} className="flex items-center gap-3"><CheckCircle className="text-blue-300" size={20}/><span className="text-sm text-blue-50">{item}</span></div>)}</div></div>
//         <div className="relative z-10 flex items-center justify-between text-xs text-blue-200"><p>© {new Date().getFullYear()} SupportDesk.</p><div className="flex items-center gap-2"><ShieldCheck size={16}/> Secure Authentication</div></div>
//       </section>
//       <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8"><div className="w-full max-w-md">
//         <Link to="/" className="mb-10 flex items-center justify-center gap-3 lg:hidden"><div className="rounded-xl bg-blue-600 p-3 text-white"><LifeBuoy size={25}/></div><div><h1 className="text-xl font-bold text-slate-900">SupportDesk</h1><p className="text-xs text-slate-500">Customer Support Portal</p></div></Link>
//         <div className="mb-8"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Headphones size={25}/></div><h2 className="text-3xl font-bold text-slate-900">Welcome back!</h2><p className="mt-2 text-sm text-slate-500">Sign in to access your SupportDesk account.</p></div>
//         {message&&<div role="alert" className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{message}</div>}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div><label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19}/><input id="email" type="email" required autoComplete="email" value={form.email} onChange={e=>setForm(v=>({...v,email:e.target.value}))} placeholder="you@example.com" className={`${inputClass} pl-12`}/></div></div>
//           <div><div className="mb-2 flex justify-between"><label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label><Link to="/forgot-password" className="text-xs font-semibold text-blue-600 hover:underline">Forgot password?</Link></div><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19}/><input id="password" type={showPassword?"text":"password"} required autoComplete="current-password" value={form.password} onChange={e=>setForm(v=>({...v,password:e.target.value}))} placeholder="Enter your password" className={`${inputClass} pl-12 pr-12`}/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" aria-label={showPassword?"Hide password":"Show password"}>{showPassword?<EyeOff size={19}/>:<Eye size={19}/>}</button></div></div>
//           <button disabled={loading} className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{loading?"Signing in...":"Sign in"}</button>
//         </form>
//         <p className="mt-7 text-center text-sm text-slate-600">Don't have an account? <Link to="/register" className="font-semibold text-blue-600 hover:underline">Create account</Link></p>
//         <p className="mt-5 text-center text-xs text-slate-400">Sign in uses your verified email and password.</p>
//       </div></section>
//     </div>
//   );
// }







import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LifeBuoy,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Headphones,
  CheckCircle,
  KeyRound,
  ArrowLeft,
} from "lucide-react";
import api, { getErrorMessage } from "../../services/api";

const inputClass =
  "w-full rounded-xl border border-gray-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

const dashboardRoutes = {
  customer: "/customer/dashboard",
  support_agent: "/agent/dashboard",
  admin: "/admin/dashboard",
};

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [mode, setMode] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((value) => value - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const saveLoginAndNavigate = (data) => {
    const user = data.data?.user;
    const token = data.data?.token;
    const destination = dashboardRoutes[user?.role];

    if (!user || !token || !destination) {
      throw new Error("The server returned an incomplete login response.");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    navigate(destination, { replace: true });
  };

  // EXISTING PASSWORD LOGIN
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      saveLoginAndNavigate(data);
    } catch (error) {
      setMessage(
        getErrorMessage(error, "Login failed. Please check your credentials.")
      );
    } finally {
      setLoading(false);
    }
  };

  // SEND LOGIN OTP
  const handleSendOTP = async () => {
    if (!form.email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    setMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login-otp", {
        email: form.email.trim().toLowerCase(),
      });

      setOtpSent(true);
      setCountdown(60);
      setSuccessMessage(data.message || "If an eligible account exists, a login OTP will be sent.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Unable to send OTP."));
    } finally {
      setLoading(false);
    }
  };

  // VERIFY LOGIN OTP
  const handleVerifyOTP = async (event) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    setMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/verify-login-otp", {
        email: form.email.trim().toLowerCase(),
        otp,
      });

      saveLoginAndNavigate(data);
    } catch (error) {
      setMessage(
        getErrorMessage(error, "OTP verification failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const changeMode = (newMode) => {
    setMode(newMode);
    setMessage("");
    setSuccessMessage("");
    setOtp("");
    setOtpSent(false);
    setCountdown(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-2">

      {/* LEFT SIDE */}
      <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border-[50px] border-white/5" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full border-[50px] border-white/5" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <div className="rounded-xl bg-white/15 p-3">
            <LifeBuoy size={30} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">SupportDesk</h1>
            <p className="text-xs text-blue-200">Customer Support Portal</p>
          </div>
        </Link>

        <div className="relative z-10 max-w-lg">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold">
            YOUR SUPPORT PARTNER
          </span>

          <h2 className="mt-8 text-5xl font-bold leading-tight">
            We're here to
            <span className="block text-blue-300">make things easier.</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-blue-100">
            Get help, track your requests, and communicate with our support
            team through one simple platform.
          </p>

          <div className="mt-10 space-y-5">
            {[
              "Create and track support tickets",
              "Communicate directly with support agents",
              "Review ticket progress and updates",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="text-blue-300" size={20} />
                <span className="text-sm text-blue-50">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-blue-200">
          <p>© {new Date().getFullYear()} SupportDesk.</p>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} />
            Secure Authentication
          </div>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">

          <Link
            to="/"
            className="mb-10 flex items-center justify-center gap-3 lg:hidden"
          >
            <div className="rounded-xl bg-blue-600 p-3 text-white">
              <LifeBuoy size={25} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">SupportDesk</h1>
              <p className="text-xs text-slate-500">Customer Support Portal</p>
            </div>
          </Link>

          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Headphones size={25} />
            </div>

            <h2 className="text-3xl font-bold text-slate-900">
              Welcome back!
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to access your SupportDesk account.
            </p>
          </div>

          {/* LOGIN TABS */}
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => changeMode("password")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold transition ${mode === "password"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
                }`}
            >
              <Lock size={16} />
              Password
            </button>

            <button
              type="button"
              onClick={() => changeMode("otp")}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold transition ${mode === "otp"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
                }`}
            >
              <KeyRound size={16} />
              Email OTP
            </button>
          </div>

          {message && (
            <div role="alert" className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {message}
            </div>
          )}

          {successMessage && (
            <div role="status" className="mb-5 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          {/* EMAIL FIELD */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email address
            </label>

            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={19}
              />

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => {
                  setForm((v) => ({ ...v, email: e.target.value }));
                  setMessage("");
                  setSuccessMessage("");
                  setOtpSent(false);
                  setOtp("");
                  setCountdown(0);
                }}
                placeholder="you@example.com"
                className={`${inputClass} pl-12`}
              />
            </div>
          </div>

          {/* PASSWORD LOGIN */}
          {mode === "password" && (
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <div className="mb-2 flex justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={19}
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((v) => ({ ...v, password: e.target.value }))
                    }
                    placeholder="Enter your password"
                    className={`${inputClass} pl-12 pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          )}

          {/* EMAIL OTP LOGIN */}
          {mode === "otp" && (
            <div className="space-y-5">

              {!otpSent ? (
                <>
                  <p className="text-sm leading-6 text-slate-500">
                    We'll send a secure six-digit login code to your registered
                    email address.
                  </p>

                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Mail size={18} />
                    {loading ? "Sending OTP..." : "Send Login OTP"}
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="otp"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Enter 6-digit OTP
                    </label>

                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                        setMessage("");
                      }}
                      placeholder="Enter OTP"
                      className={`${inputClass} text-center text-xl tracking-[0.5em]`}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    className="w-full rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Verifying..." : "Verify OTP & Sign in"}
                  </button>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                        setMessage("");
                        setSuccessMessage("");
                      }}
                      className="flex items-center gap-1 font-medium text-slate-500 hover:text-blue-600"
                    >
                      <ArrowLeft size={15} />
                      Change email
                    </button>

                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={loading || countdown > 0}
                      className="font-semibold text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-slate-400"
                    >
                      {countdown > 0
                        ? `Resend in ${countdown}s`
                        : "Resend OTP"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <p className="mt-7 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:underline"
            >
              Create account
            </Link>
          </p>

          <p className="mt-5 text-center text-xs text-slate-400">
            Secure sign-in using your verified email address.
          </p>
        </div>
      </section>
    </div>
  );
}

