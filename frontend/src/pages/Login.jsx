import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Sparkles, BrainCircuit, ArrowRight } from 'lucide-react';

const Chrome = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="21.17" y1="8" x2="12" y2="8" />
        <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
        <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
    </svg>
);

const Github = ({ className = "w-4 h-4" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Mock login - in a real app, this would call an API
        setTimeout(() => {
            setIsLoading(false);
            navigate('/home');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
            {/* Premium Decorative Light Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[700px] h-[700px] bg-purple-50 rounded-full blur-[120px] animate-blob animation-delay-2000" />
            </div>

            {/* Back to Home */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-10 left-10 group flex items-center gap-3 bg-white text-slate-500 px-6 py-3 rounded-2xl hover:text-indigo-600 transition-all shadow-sm border border-slate-100 font-black text-[10px] uppercase tracking-widest z-50"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Site
            </button>

            <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                {/* Left Side: Branding & Value Prop */}
                <div className="hidden lg:block space-y-12">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-200">
                            <BrainCircuit className="w-10 h-10 text-white" />
                        </div>
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">Insightful.</span>
                    </div>

                    <div className="space-y-8">
                        <h1 className="text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                            Access your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Intelligence</span> Hub.
                        </h1>
                        <p className="text-slate-500 text-xl font-medium max-w-md leading-relaxed">
                            Log in to manage your strategic roadmap and transform customer feedback into technical growth.
                        </p>
                    </div>

                    <div className="flex items-center gap-10 pt-10 border-t border-slate-100">
                        <div>
                            <div className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">98.4%</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Precision</div>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">1.2M+</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insights Analyzed</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full max-w-lg mx-auto">
                    <div className="bg-white/80 backdrop-blur-2xl p-10 md:p-16 rounded-[4rem] border border-white shadow-[0_32px_128px_-32px_rgba(79,70,229,0.15)] relative overflow-hidden group">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/0 via-purple-50/0 to-white/0 group-hover:from-indigo-50/20 group-hover:via-purple-50/10 group-hover:to-white/20 transition-all duration-1000" />

                        <div className="relative z-10 space-y-10">
                            <div className="space-y-2">
                                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Sign In</h2>
                                <p className="text-slate-500 font-medium tracking-tight">Enter your credentials to continue</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                                    <div className="relative group/field">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-indigo-600 transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@company.com"
                                            className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:outline-none focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                                        <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Forgot?</button>
                                    </div>
                                    <div className="relative group/field">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/field:text-indigo-600 transition-colors">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:outline-none focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 transition-all text-slate-900 font-bold placeholder:text-slate-300 shadow-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-indigo-200"
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-4">
                                        {isLoading ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Authenticate
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                            </>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity animate-gradient" />
                                </button>
                            </form>

                            <div className="relative py-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-100" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                                    <span className="bg-white px-6 text-slate-400 font-bold">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <button className="flex items-center justify-center gap-3 py-4 border-2 border-slate-100 rounded-[1.5rem] hover:bg-slate-50 transition-all font-bold text-xs text-slate-600">
                                    <Chrome className="w-4 h-4" />
                                    Google
                                </button>
                                <button className="flex items-center justify-center gap-3 py-4 border-2 border-slate-100 rounded-[1.5rem] hover:bg-slate-50 transition-all font-bold text-xs text-slate-600">
                                    <Github className="w-4 h-4" />
                                    GitHub
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-center mt-12 text-slate-500 font-medium tracking-tight">
                        Don't have an account? <button className="text-indigo-600 font-black hover:underline uppercase tracking-widest text-[10px] ml-2">Request Access</button>
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                .animate-blob {
                    animation: blob 15s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s infinite;
                }
            `}</style>
        </div>
    );
};

export default Login;
