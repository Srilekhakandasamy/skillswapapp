import { Link, useNavigate, useLocation } from "react-router-dom";
import { clearToken } from "../services/authService";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    clearToken();
    navigate("/");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Skills", path: "/skills", icon: "💡" },
    { name: "Bookings", path: "/bookings", icon: "📚" },
    { name: "Reviews", path: "/reviews", icon: "⭐" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-indigo-600 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* LOGO */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-xl font-black tracking-tight text-white transition hover:opacity-95"
        >
          <span className="text-2xl">⚡</span>
          <span>SkillSwap</span>
        </Link>

        {/* NAV LINKS & LOGOUT */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-white/20 text-white shadow-inner"
                    : "text-indigo-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="mr-1.5">{link.icon}</span>
                {link.name}
              </Link>
            );
          })}

          <button
            onClick={logout}
            className="ml-2 rounded-lg bg-red-500/90 px-3 py-1.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
