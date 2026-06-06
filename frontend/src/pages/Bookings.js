import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Bookings() {
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  let userId = "";
  if (token) {
    try {
      userId = JSON.parse(atob(token.split(".")[1])).id;
    } catch (err) {
      console.log("Token parse error", err);
    }
  }

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const accept = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${id}`,
        { status: "accepted" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Request Accepted ✅");
      fetchBookings();
    } catch (err) {
      console.log(err);
      alert("Error ❌");
    }
  };

  const reject = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${id}`,
        { status: "rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Request Rejected ❌");
      fetchBookings();
    } catch (err) {
      console.log(err);
      alert("Error ❌");
    }
  };

  const completeSession = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${id}/complete`,
        { goalCompleted: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Session marked completed ✅");
      fetchBookings();
    } catch (err) {
      console.log(err);
      alert("Error marking completed ❌");
    }
  };

  const [meetingDateById, setMeetingDateById] = useState({});
  const [meetingLinkById, setMeetingLinkById] = useState({});
  const [meetingMessageById, setMeetingMessageById] = useState({});

  const saveMeetingDetails = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${id}/meeting`,
        {
          meetingDate: meetingDateById[id] || null,
          meetingLink: meetingLinkById[id] || "",
          meetingMessage: meetingMessageById[id] || "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Meeting details saved ✅");
      fetchBookings();
    } catch (err) {
      console.log(err);
      alert("Error saving meeting details ❌");
    }
  };


  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#f4f7fb",
        minHeight: "100vh",
        paddingBottom: "30px",
      }}
    >
      <Navbar />

      <div
        style={{
          width: "80%",
          margin: "auto",
          paddingTop: "20px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#333",
          }}
        >
          My Bookings 📚
        </h1>

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
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <p>
                <b>From:</b> {b.sender?.name || "Unknown User"}
              </p>
              <p>
                <b>To:</b> {b.receiver?.name || "Unknown User"}
              </p>
              <p>
                <b>Requested Skill:</b> {b.skillRequestedId?.title || b.skillRequested}
              </p>
              <p>
                <b>Goal:</b> {b.sessionGoal}
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
                    fontWeight: "bold",
                  }}
                >
                  {b.status}
                </span>
              </p>

              {/* Pending: receiver can accept/reject */}
              {b.status === "pending" && b.receiverId?._id === userId && (
                <>
                  <button
                    onClick={() => accept(b._id)}
                    style={{
                      background: "green",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => reject(b._id)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  >
                    Reject
                  </button>
                </>
              )}

              {/* Accepted: either participant can complete (until completed) */}
              {b.status === "accepted" &&
                b.completed !== true &&
                (b.receiverId?._id === userId || b.senderId?._id === userId) && (
                  <div style={{ marginTop: "10px" }}>
                    <button
                      onClick={() => completeSession(b._id)}
                      style={{
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Complete session
                    </button>
                  </div>
                )}

              {/* Sender: meeting/contact details */}
              {b.status === "accepted" && b.senderId?._id === userId && (
                <div style={{ marginTop: "15px", paddingTop: "10px", borderTop: "1px solid #eee" }}>
                  <h3 style={{ margin: "0 0 10px 0" }}>Meeting details</h3>

                  <label style={{ display: "block", marginBottom: "10px" }}>
                    <b>Meeting Date/Time</b>
                    <input
                      type="datetime-local"
                      value={meetingDateById[b._id] ?? ""}
                      onChange={(e) => setMeetingDateById((prev) => ({ ...prev, [b._id]: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                      style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "6px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </label>

                  <label style={{ display: "block", marginBottom: "10px" }}>
                    <b>Meeting Link (Zoom/Meet)</b>
                    <input
                      placeholder="https://..."
                      value={meetingLinkById[b._id] ?? ""}
                      onChange={(e) => setMeetingLinkById((prev) => ({ ...prev, [b._id]: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "6px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                      }}
                    />
                  </label>

                  <label style={{ display: "block", marginBottom: "10px" }}>
                    <b>Message / Availability</b>
                    <textarea
                      placeholder="Share your availability, agenda, etc."
                      value={meetingMessageById[b._id] ?? ""}
                      onChange={(e) => setMeetingMessageById((prev) => ({ ...prev, [b._id]: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "6px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        minHeight: "90px",
                      }}
                    />
                  </label>

                  <button
                    onClick={() => saveMeetingDetails(b._id)}
                    style={{
                      background: "green",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      width: "100%",
                    }}
                  >
                    Save meeting details
                  </button>

                  {/* Show saved */}
                  {(b.meetingDate || b.meetingLink || b.meetingMessage) && (
                    <div style={{ marginTop: "12px", background: "#f8fafc", padding: "12px", borderRadius: "10px" }}>
                      <p><b>Saved meeting:</b></p>
                      {b.meetingDate && <p>Date: {new Date(b.meetingDate).toLocaleString()}</p>}
                      {b.meetingLink && (
                        <p>
                          Link: <a href={b.meetingLink} target="_blank" rel="noreferrer">Open</a>
                        </p>
                      )}
                      {b.meetingMessage && <p>Message: {b.meetingMessage}</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Receiver: just show details if already saved */}
              {b.status === "accepted" && b.senderId?._id !== userId && (
                <div style={{ marginTop: "15px" }}>
                  <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "10px" }}>
                    <p><b>Contact email:</b> {b.contactEmail || "Not provided"}</p>
                    {(b.meetingDate || b.meetingLink || b.meetingMessage) && (
                      <>
                        <p><b>Meeting details:</b></p>
                        {b.meetingDate && <p>Date: {new Date(b.meetingDate).toLocaleString()}</p>}
                        {b.meetingLink && (
                          <p>
                            Link: <a href={b.meetingLink} target="_blank" rel="noreferrer">Open</a>
                          </p>
                        )}
                        {b.meetingMessage && <p>Message: {b.meetingMessage}</p>}
                      </>
                    )}
                  </div>
                </div>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
}


export default Bookings;

