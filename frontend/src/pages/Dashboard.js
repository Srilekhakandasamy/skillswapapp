import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Dashboard() {

  const [skills, setSkills] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [matches, setMatches] = useState([]);

  const token = localStorage.getItem("token");

  // ✅ SAFE USER ID
  let userId = "";

  if (token) {
    try {
      userId = JSON.parse(
        atob(token.split(".")[1])
      ).id;

    } catch (err) {
      console.log("Token Error");
    }
  }

  // ✅ FETCH ALL DATA
  const fetchData = async () => {

    try {

      // 🔥 GET SKILLS
      const skillsRes = await axios.get(
        "http://localhost:5000/api/skills"
      );

      // 🔥 GET BOOKINGS
      const bookingRes = await axios.get(
        "http://localhost:5000/api/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // 🔥 GET MATCHES
      const matchRes = await axios.get(
        "http://localhost:5000/api/skills/match",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // ✅ FILTER ONLY MY SKILLS
      const mySkills = skillsRes.data.filter(
        (s) => s.user?._id === userId
      );

      setSkills(mySkills);

      setBookings(bookingRes.data);

      setMatches(matchRes.data);

    } catch (err) {

      console.log(err);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (

    <div
      style={{
        backgroundColor: "#f4f7fb",
        minHeight: "100vh",
        paddingBottom: "30px"
      }}
    >

      <Navbar />

      <div
        style={{
          width: "80%",
          margin: "auto",
          paddingTop: "20px"
        }}
      >

        {/* ✅ TITLE */}
        <h1
          style={{
            textAlign: "center",
            color: "#2563eb",
            marginBottom: "30px"
          }}
        >
          My Dashboard 🚀
        </h1>

        {/* ================= MY SKILLS ================= */}

        <h2>📘 My Skills</h2>

        {skills.length === 0 ? (

          <p>No skills added</p>

        ) : (

          skills.map((s) => (

            <div
              key={s._id}

              style={{
                background: "white",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
              }}
            >

              <h3 style={{ color: "#2563eb" }}>
                {s.title}
              </h3>

              <p>{s.description}</p>

              <p>
                <b>Type:</b> {s.type || "Skill"}
              </p>

            </div>
          ))
        )}

        {/* ================= BOOKINGS ================= */}

        <h2>📚 My Bookings</h2>

        {bookings.length === 0 ? (

          <p>No bookings found</p>

        ) : (

          bookings.map((b) => (

            <div
              key={b._id}

              style={{
                background: "white",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
              }}
            >

              <p>
                <b>From:</b>{" "}
                  {b.sender?.name || "Unknown"}
              </p>

              <p>
                <b>Requested Skill:</b>{" "}
                {b.skillRequested}
              </p>

              <p>
                <b>Goal:</b>{" "}
                {b.sessionGoal}
              </p>

              <p>
                <b>Status:</b>{" "}

                <span
                  style={{
                    color:
                      b.status === "accepted"
                        ? "green"
                        : b.status === "rejected"
                        ? "red"
                        : "orange",

                    fontWeight: "bold"
                  }}
                >
                  {b.status}
                </span>
              </p>

            </div>
          ))
        )}

        {/* ================= MATCHES ================= */}

        <h2>🔥 Matched Users</h2>

        {matches.length === 0 ? (

          <p>No matches found</p>

        ) : (

          matches.map((user, index) => (

            <div
              key={index}

              style={{
                background: "white",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "12px",
                border: "2px solid green",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
              }}
            >

              <h3 style={{ color: "green" }}>
                {user.name}
              </h3>

              <p>{user.email}</p>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default Dashboard;