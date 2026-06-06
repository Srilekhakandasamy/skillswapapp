import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {

    try {

      const res = await axios.post(
        "/api/auth/signup",
        {
          name,
          email,
          password,
        }
      );

      console.log(res.data);

      alert("Signup successful ✅");

      // 🔥 REDIRECT TO LOGIN
      navigate("/");

    } catch (err) {

      console.log(err.response?.data);

      alert(
        err.response?.data?.message ||
        "Signup failed ❌"
      );
    }
  };

return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-50">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-10">
        <div className="w-full">
          <div className="mb-6 text-center">
            <div className="text-4xl font-black tracking-tight text-white">Skill Swap</div>
            <div className="mt-2 text-sm font-medium text-indigo-100">Teach what you know. Learn what you need.</div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200/60 sm:p-8">
            <h2 className="mb-5 text-center text-2xl font-bold text-slate-900">Create account</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Name</label>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                  type="password"
                  placeholder="Choose a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                onClick={handleSignup}
                className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Sign up
              </button>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate("/")}
              className="font-bold text-indigo-700 hover:text-indigo-900"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;