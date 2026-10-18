import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { setToken } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (overrideEmail, overridePass) => {
    const loginEmail = overrideEmail || email;
    const loginPass = overridePass || password;

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email: loginEmail, password: loginPass });
      setToken(res.data.token);
      alert("Login successful 🔥");
      navigate("/dashboard");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  const fillAndLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    handleLogin(demoEmail, demoPass);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          <div className="mb-7 text-center">
            <div className="text-4xl font-black tracking-tight text-white drop-shadow">
              ⚡ SkillSwap
            </div>
            <div className="mt-2 text-sm font-medium text-indigo-100">
              Exchange skills directly with peers — no money needed.
            </div>
          </div>

          <div className="rounded-2xl bg-white/95 p-6 shadow-xl ring-1 ring-slate-200/60 backdrop-blur sm:p-8">
            <h2 className="mb-6 text-center text-2xl font-bold text-slate-900">
              Sign In to Your Account
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                onClick={() => handleLogin()}
                disabled={loading}
                className="mt-2 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* ONE-CLICK DEMO ACCOUNTS */}
              <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3">
                <div className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                  Quick Demo Accounts (1-click sign in):
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fillAndLogin("alice@example.com", "password123")}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-200 transition hover:bg-indigo-600 hover:text-white"
                  >
                    👤 Alice (Offers React, Wants Figma)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillAndLogin("bob@example.com", "password123")}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-200 transition hover:bg-indigo-600 hover:text-white"
                  >
                    👤 Bob (Offers Figma, Wants React)
                  </button>
                </div>
              </div>

              <div className="pt-2 text-center text-sm text-slate-600">
                Don’t have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="font-bold text-indigo-700 hover:text-indigo-900 hover:underline"
                >
                  Create one
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
