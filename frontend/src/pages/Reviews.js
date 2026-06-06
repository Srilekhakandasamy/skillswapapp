import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Reviews() {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const token = localStorage.getItem("token");

  const currentUserId = (() => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return null;
    }
  })();

  const fetchCompletedBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings/completed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) fetchCompletedBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedBooking = bookings.find((b) => b._id === selectedBookingId);

  useEffect(() => {
    if (!selectedBooking || !currentUserId) return;

    // toUserId = the other participant
    const otherId =
      selectedBooking.senderId?._id?.toString() === currentUserId.toString()
        ? selectedBooking.receiverId?._id?.toString()
        : selectedBooking.senderId?._id?.toString();

    setToUserId(otherId || "");
  }, [selectedBookingId, selectedBooking, currentUserId]);

  const addReview = async () => {
    try {
      if (!selectedBookingId) {
        alert("Please select a completed session");
        return;
      }
      if (!toUserId) {
        alert("Unable to determine the other user for this session");
        return;
      }

      const r = Number(rating);
      if (!Number.isFinite(r) || r < 1 || r > 5) {
        alert("Rating must be between 1 and 5");
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/reviews",
        {
          bookingId: selectedBookingId,
          toUserId,
          rating: r,
          comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(res.data);
      alert("Review added successfully ✅");

      setSelectedBookingId("");
      setToUserId("");
      setRating("");
      setComment("");
      fetchCompletedBookings();
    } catch (err) {
      console.log(err);
      console.log(err.response?.data);
      alert("Error adding review ❌");
    }
  };

  return (
    <div>
      <Navbar />

      <div
        style={{
          width: "450px",
          margin: "40px auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
        }}
      >
        <h2>Add Review ⭐</h2>

        <label>
          Select completed session:
          <select
            value={selectedBookingId}
            onChange={(e) => setSelectedBookingId(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          >
            <option value="">Choose a session</option>
            {bookings.map((b) => {
              const otherName =
                b.senderId?._id?.toString() === currentUserId?.toString()
                  ? b.receiverId?.name
                  : b.senderId?.name;

              return (
                <option key={b._id} value={b._id}>
                  {otherName ? otherName : "Participant"} — {b.sessionGoal || "Session"}
                </option>
              );
            })}
          </select>
        </label>

        <p style={{ marginTop: 0, marginBottom: "10px" }}>
          Rating user: <b>{toUserId ? toUserId : "-"}</b>
        </p>

        <input
          type="number"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <textarea
          placeholder="Feedback"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          onClick={addReview}
          style={{
            background: "green",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}

export default Reviews;

