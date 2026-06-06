import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  // ✅ LOGOUT
  const logout = () => {

    localStorage.removeItem("token");

    navigate("/");
  };

  return (

    <div
      style={{
        backgroundColor: "#2563eb",
        padding: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >

      {/* LOGO */}
      <h2
        style={{
          color: "white",
          margin: 0
        }}
      >
        Skill Swap 🚀
      </h2>

      {/* NAV LINKS */}
      <div
        style={{
          display: "flex",
          gap: "20px"
        }}
      >

        <Link
          to="/dashboard"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          Dashboard
        </Link>

        <Link
          to="/skills"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          Skills
        </Link>

        <Link
          to="/bookings"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          Bookings
        </Link>

        <Link
          to="/reviews"
          style={{
            color: "white",
            textDecoration: "none"
          }}
        >
          Reviews
        </Link>

        {/* LOGOUT */}
        <button
          onClick={logout}

          style={{
            background: "red",
            color: "white",
            border: "none",
            padding: "5px 12px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;


