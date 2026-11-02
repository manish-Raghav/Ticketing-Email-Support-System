
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Headset, Menu, X, ArrowRight, ArrowUpRight,
    Ticket, Mail, Users, BarChart3, ShieldCheck,
    Clock3, CheckCircle2, MessageSquare, Search,
    Bell, Paperclip, Send, ChevronDown, Zap,
    CircleHelp, Settings, LayoutDashboard
} from "lucide-react";

const features = [
    {
        icon: Ticket,
        title: "Ticket Management",
        desc: "Create, assign, prioritize and track support requests from one centralized workspace.",
    },
    {
        icon: Mail,
        title: "Email Conversations",
        desc: "Continue ticket conversations directly through email. Every reply stays synchronized.",
    },
    {
        icon: Users,
        title: "Team Collaboration",
        desc: "Assign agents, share internal notes and work together to resolve customer issues.",
    },
    {
        icon: BarChart3,
        title: "Reports & Analytics",
        desc: "Understand ticket volume, resolution times and support team performance.",
    },
    {
        icon: ShieldCheck,
        title: "Secure Platform",
        desc: "Role-based access, OTP verification and secure authentication protect your data.",
    },
    {
        icon: Clock3,
        title: "Complete History",
        desc: "Track every conversation, assignment, status update and important ticket activity.",
    },
];

const steps = [
    ["01", "Create an account", "Register securely and verify your account."],
    ["02", "Submit a ticket", "Explain your issue and select its priority."],
    ["03", "Get connected", "A support agent reviews and responds to your request."],
    ["04", "Track resolution", "Follow every update until your issue is resolved."],
];

function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

                <Link to="/" className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                        <Headset size={23} />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                            Support<span className="text-blue-600">Hub</span>
                        </h1>
                        <p className="text-[9px] font-semibold tracking-[2px] text-slate-400">
                            SUPPORT MANAGEMENT
                        </p>
                    </div>
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    <a href="#home" className="text-sm font-semibold text-blue-600">Home</a>
                    <a href="#features" className="text-sm text-slate-600 hover:text-blue-600">Features</a>
                    <a href="#process" className="text-sm text-slate-600 hover:text-blue-600">How it works</a>
                    <a href="#contact" className="text-sm text-slate-600 hover:text-blue-600">Contact</a>
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <Link to="/login" className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600">
                        Sign in
                    </Link>
                    <Link to="/register" className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
                        Get Started <ArrowUpRight size={16} />
                    </Link>
                </div>

                <button
                    className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                >
                    {open ? <X /> : <Menu />}
                </button>
            </nav>

            {open && (
                <div className="border-t border-slate-100 bg-white p-5 md:hidden">
                    <div className="flex flex-col gap-5 text-sm font-medium text-slate-700">
                        <a href="#home" onClick={() => setOpen(false)}>Home</a>
                        <a href="#features" onClick={() => setOpen(false)}>Features</a>
                        <a href="#process" onClick={() => setOpen(false)}>How it works</a>
                        <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
                        <Link to="/login" onClick={() => setOpen(false)}>Sign in</Link>
                        <Link to="/register" onClick={() => setOpen(false)} className="rounded-lg bg-blue-600 p-3 text-center text-white">
                            Create Account
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}

function DashboardMockup() {
    return (
        <div className="relative mx-auto w-full max-w-[590px]">

            <div className="absolute -inset-8 rounded-full bg-blue-200/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/60">

                {/* Browser top */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
                    <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    </div>
                    <span className="text-[10px] text-slate-400">app.supporthub.com</span>
                    <div className="w-8" />
                </div>

                <div className="flex min-h-[390px]">

                    {/* Mini Sidebar */}
                    <aside className="hidden w-14 shrink-0 flex-col items-center gap-6 border-r border-slate-100 bg-slate-50 py-6 sm:flex">
                        <div className="rounded-lg bg-blue-600 p-2 text-white">
                            <Headset size={17} />
                        </div>
                        <LayoutDashboard size={18} className="text-blue-600" />
                        <Ticket size={18} className="text-slate-400" />
                        <MessageSquare size={18} className="text-slate-400" />
                        <Users size={18} className="text-slate-400" />
                        <Settings size={18} className="text-slate-400" />
                    </aside>

                    {/* Main Content */}
                    <div className="min-w-0 flex-1 bg-slate-50 p-4 sm:p-5">

                        <div className="mb-5 flex items-center justify-between gap-2">
                            <div>
                                <p className="text-[10px] font-medium text-slate-400">OVERVIEW / DASHBOARD</p>
                                <h3 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">Good morning, Manish</h3>
                                <p className="text-[10px] text-slate-500 sm:text-xs">Here's your support activity today.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500">
                                    <Bell size={15} />
                                </button>
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">MK</div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                            {[
                                { name: "Open Tickets", value: "24", icon: Ticket, color: "text-blue-600", bg: "bg-blue-50" },
                                { name: "Pending", value: "12", icon: Clock3, color: "text-amber-600", bg: "bg-amber-50" },
                                { name: "Resolved", value: "86", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                                { name: "Closed", value: "45", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
                            ].map((item) => (
                                <div key={item.name} className="rounded-xl border border-slate-100 bg-white p-3">
                                    <div className={`mb-2 inline-flex rounded-lg p-2 ${item.bg} ${item.color}`}>
                                        <item.icon size={15} />
                                    </div>
                                    <p className="text-xl font-bold text-slate-900">{item.value}</p>
                                    <p className="mt-1 text-[9px] text-slate-500 sm:text-[10px]">{item.name}</p>
                                </div>
                            ))}
                        </div>

                        {/* Tickets */}
                        <div className="mt-4 rounded-xl border border-slate-100 bg-white p-4">
                            <div className="mb-4 flex items-center justify-between">
                                <h4 className="text-xs font-bold text-slate-800">Recent Tickets</h4>
                                <span className="text-[10px] font-semibold text-blue-600">View all</span>
                            </div>

                            <div className="space-y-3">
                                {[
                                    ["TKT-2026-001", "Unable to access account", "Open", "bg-blue-50 text-blue-700"],
                                    ["TKT-2026-002", "Payment confirmation issue", "Pending", "bg-amber-50 text-amber-700"],
                                    ["TKT-2026-003", "Profile update request", "Resolved", "bg-emerald-50 text-emerald-700"],
                                ].map((ticket) => (
                                    <div key={ticket[0]} className="flex items-center justify-between gap-2 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                                        <div className="min-w-0">
                                            <p className="truncate text-[10px] font-semibold text-slate-800 sm:text-xs">{ticket[1]}</p>
                                            <p className="mt-1 text-[9px] text-slate-400">{ticket[0]}</p>
                                        </div>
                                        <span className={`shrink-0 rounded-md px-2 py-1 text-[9px] font-semibold ${ticket[3]}`}>
                                            {ticket[2]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Email Notification */}
                        <div className="mt-3 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                            <div className="rounded-lg bg-white p-2 text-blue-600">
                                <Mail size={17} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-800">Email conversation synced</p>
                                <p className="text-[9px] text-slate-500">A new customer reply has been received.</p>
                            </div>
                            <CheckCircle2 className="ml-auto text-emerald-500" size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating notification */}
            <div className="absolute -right-3 top-24 hidden rounded-xl border border-slate-100 bg-white p-3 shadow-xl sm:block lg:-right-9">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                        <MessageSquare size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-slate-800">New reply received</p>
                        <p className="text-[10px] text-slate-400">Ticket conversation updated</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Hero() {
    return (
        <section id="home" className="relative overflow-hidden bg-[#F7FAFF]">
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />

            <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

                <div>
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-semibold text-blue-700 shadow-sm">
                        <Zap size={14} />
                        The smarter way to handle customer support
                    </div>

                    <h1 className="max-w-xl text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-950 sm:text-5xl lg:text-[60px]">
                        Every customer deserves
                        <span className="block text-blue-600">better support.</span>
                    </h1>

                    <p className="mt-7 max-w-lg text-base leading-8 text-slate-500">
                        Bring every support request, conversation and team interaction
                        together. Manage tickets effortlessly and deliver better customer
                        experiences from one powerful workspace.
                    </p>

                    <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                        <Link to="/register" className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700">
                            Get Started <ArrowRight size={17} />
                        </Link>
                        <a href="#features" className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-600">
                            Explore Platform
                        </a>
                    </div>

                    <div className="mt-9 flex flex-wrap gap-5 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-500" /> Secure access</span>
                        <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-500" /> Email integration</span>
                        <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-500" /> Easy tracking</span>
                    </div>
                </div>

                <DashboardMockup />
            </div>
        </section>
    );
}

function Features() {
    return (
        <section id="features" className="bg-white px-5 py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <p className="text-xs font-bold uppercase tracking-[3px] text-blue-600">Everything in one place</p>
                    <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Powerful tools for a better support experience
                    </h2>
                    <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
                        From the first customer request to the final resolution, manage your entire support workflow with ease.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((item) => (
                        <div key={item.title} className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                                <item.icon size={23} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                            <p className="mt-3 text-sm leading-7 text-slate-500">{item.desc}</p>
                            <div className="mt-5 flex items-center gap-2 text-xs font-bold text-blue-600">
                                Learn more <ArrowRight size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Process() {
    return (
        <section id="process" className="bg-[#F7FAFF] px-5 py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <p className="text-xs font-bold uppercase tracking-[3px] text-blue-600">Simple workflow</p>
                    <h2 className="mt-5 text-3xl font-extrabold text-slate-900 sm:text-4xl">How SupportHub works</h2>
                    <p className="mt-4 text-sm leading-7 text-slate-500">A simple and transparent process from ticket creation to successful resolution.</p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <div key={step[0]} className="relative rounded-2xl border border-slate-200 bg-white p-7">
                            <div className="mb-5 flex items-center justify-between">
                                <span className="text-3xl font-extrabold text-blue-100">{step[0]}</span>
                                <div className="h-2 w-2 rounded-full bg-blue-600" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900">{step[1]}</h3>
                            <p className="mt-3 text-sm leading-7 text-slate-500">{step[2]}</p>
                            {index !== 3 && <ArrowRight className="absolute -right-6 top-1/2 hidden -translate-y-1/2 text-blue-300 lg:block" size={20} />}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ConversationPreview() {
    return (
        <section className="bg-white px-5 py-24 lg:px-8">
            <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[3px] text-blue-600">Connected communication</p>
                    <h2 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
                        One conversation. Every channel.
                    </h2>
                    <p className="mt-5 text-sm leading-8 text-slate-500">
                        Your customers shouldn't have to repeat themselves. With two-way
                        email integration, replies sent through email automatically become
                        part of the same ticket conversation.
                    </p>

                    <div className="mt-8 space-y-5">
                        {[
                            "Send ticket confirmations automatically.",
                            "Notify agents when tickets are assigned.",
                            "Receive customer replies through email.",
                            "Keep web and email conversations synchronized.",
                        ].map((text) => (
                            <div key={text} className="flex items-start gap-3">
                                <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-emerald-500" />
                                <p className="text-sm font-medium text-slate-700">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-xl shadow-slate-200/60 sm:p-6">
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <p className="text-xs font-bold text-slate-900">Ticket #TKT-2026-001</p>
                                <p className="mt-1 text-[10px] text-slate-400">Login access issue</p>
                            </div>
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold text-blue-700">In Progress</span>
                        </div>

                        <div className="space-y-5 py-5">
                            <div className="max-w-[85%] rounded-xl rounded-tl-none bg-slate-100 p-4">
                                <p className="text-[10px] font-bold text-slate-700">Customer · Website</p>
                                <p className="mt-2 text-xs leading-6 text-slate-600">I am unable to log in to my account. Can you please help me?</p>
                                <p className="mt-2 text-[9px] text-slate-400">10:30 AM</p>
                            </div>

                            <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-none bg-blue-600 p-4 text-white">
                                <p className="text-[10px] font-bold text-blue-100">Support Agent · Email</p>
                                <p className="mt-2 text-xs leading-6">Sure! Please try resetting your password. Let us know if you still experience the issue.</p>
                                <p className="mt-2 text-right text-[9px] text-blue-200">10:45 AM</p>
                            </div>

                            <div className="max-w-[85%] rounded-xl border border-purple-100 bg-purple-50 p-4">
                                <div className="flex items-center gap-2">
                                    <Mail size={13} className="text-purple-600" />
                                    <p className="text-[10px] font-bold text-purple-700">Customer · Email Reply</p>
                                </div>
                                <p className="mt-2 text-xs leading-6 text-slate-600">Thank you! The issue is fixed now.</p>
                                <p className="mt-2 text-[9px] text-slate-400">11:02 AM</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                            <Paperclip size={17} className="text-slate-400" />
                            <span className="flex-1 text-xs text-slate-400">Write a reply...</span>
                            <button className="rounded-lg bg-blue-600 p-2 text-white">
                                <Send size={15} />
                            </button>
                        </div>
                    </div>
                    <p className="mt-4 text-center text-[10px] text-slate-400">Illustrative conversation preview</p>
                </div>
            </div>
        </section>
    );
}

function CTA() {
    return (
        <section id="contact" className="px-5 pb-24 lg:px-8">
            <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#102B57] px-7 py-16 text-center sm:px-16">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-blue-300">
                    <Headset size={29} />
                </div>
                <h2 className="mx-auto mt-7 max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
                    Let's make customer support better, together.
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-blue-100">
                    Bring your customers, conversations and support team together in one
                    organized workspace.
                </p>
                <Link to="/register" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-bold text-blue-700 transition hover:bg-blue-50">
                    Create Your Account <ArrowRight size={17} />
                </Link>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-[#0B172B] px-5 pt-14 text-white lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-12 pb-12 sm:grid-cols-2 lg:grid-cols-4">
                <div className="sm:col-span-2">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-600 p-2.5">
                            <Headset size={22} />
                        </div>
                        <span className="text-xl font-extrabold">SupportHub</span>
                    </Link>
                    <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                        A smarter customer support platform to manage tickets, connect
                        teams and deliver better customer experiences.
                    </p>
                </div>

                <div>
                    <h3 className="mb-5 text-sm font-bold">Platform</h3>
                    <div className="flex flex-col gap-4 text-sm text-slate-400">
                        <a href="#features" className="hover:text-white">Features</a>
                        <a href="#process" className="hover:text-white">How it works</a>
                        <a href="#contact" className="hover:text-white">Contact</a>
                    </div>
                </div>

                <div>
                    <h3 className="mb-5 text-sm font-bold">Account</h3>
                    <div className="flex flex-col gap-4 text-sm text-slate-400">
                        <Link to="/login" className="hover:text-white">Sign in</Link>
                        <Link to="/register" className="hover:text-white">Create account</Link>
                        <Link to="/forgot-password" className="hover:text-white">Forgot password</Link>
                        <a href="mailto:support@yourdomain.com" className="hover:text-white">Email support</a>
                    </div>
                </div>
            </div>

            <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-t border-slate-800 py-6 text-xs text-slate-500 sm:flex-row">
                <p>© {new Date().getFullYear()} SupportHub. All rights reserved.</p>
                <p>Built for better customer support.</p>
            </div>
        </footer>
    );
}

export default function Home() {
    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <Process />
                <ConversationPreview />
                <CTA />
            </main>
            <Footer />
        </div>
    );
}
