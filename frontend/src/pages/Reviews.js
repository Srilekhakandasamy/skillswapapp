import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getUserId, getToken } from "../services/authService";
import Navbar from "../components/Navbar";

function Reviews() {
  const [completedBookings, setCompletedBookings] = useState([]);
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = getToken();
  const currentUserId = getUserId();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, reviewsRes] = await Promise.all([
        api.get("/bookings/completed").catch(() => ({ data: [] })),
        api.get("/reviews/user/me").catch(() => ({ data: [] })),
      ]);
      setCompletedBookings(bookingsRes.data || []);
      setReceivedReviews(reviewsRes.data || []);
    } catch (err) {
      console.error("Fetch reviews data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const selectedBooking = completedBookings.find((b) => b._id === selectedBookingId);

  useEffect(() => {
    if (!selectedBooking || !currentUserId) {
      setToUserId("");
      return;
    }

    const senderId = (selectedBooking.senderId?._id || selectedBooking.senderId)?.toString();
    const receiverId = (selectedBooking.receiverId?._id || selectedBooking.receiverId)?.toString();

    const otherId = senderId === currentUserId.toString() ? receiverId : senderId;
    setToUserId(otherId || "");
  }, [selectedBookingId, selectedBooking, currentUserId]);

  const otherParticipant = selectedBooking
    ? (selectedBooking.senderId?._id || selectedBooking.senderId)?.toString() === currentUserId?.toString()
      ? selectedBooking.receiverId
      : selectedBooking.senderId
    : null;

  const handleAddReview = async (e) => {
    e.preventDefault();

    if (!selectedBookingId) {
      alert("Please select a completed session to review.");
      return;
    }
    if (!toUserId) {
      alert("Could not identify the partner for this session.");
      return;
    }

    const r = Number(rating);
    if (!r || r < 1 || r > 5) {
      alert("Rating must be between 1 and 5 stars.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/reviews", {
        bookingId: selectedBookingId,
        toUserId,
        rating: r,
        comment: comment.trim(),
      });

      alert("Review submitted successfully! ⭐ Thank you for rating your peer.");
      setSelectedBookingId("");
      setToUserId("");
      setRating(5);
      setComment("");
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting review ❌");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Ratings & Reviews ⭐
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Rate your peers after completing swap sessions and build community reputation.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* SUBMIT REVIEW FORM */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">
                Write a Review
              </h2>
              <p className="text-xs text-slate-500">
                You can review peers for sessions marked as completed.
              </p>

              {completedBookings.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-slate-200 p-6 text-center">
                  <p className="text-sm text-slate-600">
                    No completed sessions available to review yet.
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Complete an accepted swap session under Bookings to unlock peer reviews!
                  </p>
                  <Link
                    to="/bookings"
                    className="mt-3 inline-block rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    View My Bookings
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="mt-5 space-y-4">
                  {/* SESSION SELECT */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Select Completed Session *
                    </label>
                    <select
                      value={selectedBookingId}
                      onChange={(e) => setSelectedBookingId(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="">-- Choose a completed session --</option>
                      {completedBookings.map((b) => {
                        const partner =
                          (b.senderId?._id || b.senderId)?.toString() === currentUserId?.toString()
                            ? b.receiverId
                            : b.senderId;

                        return (
                          <option key={b._id} value={b._id}>
                            With {partner?.name || partner?.email || "Peer"} — {b.sessionGoal || "Session"}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* PARTNER INFO PREVIEW */}
                  {otherParticipant && (
                    <div className="rounded-xl bg-indigo-50/70 p-3.5">
                      <div className="text-xs text-indigo-900 font-semibold">
                        Rating Peer:
                      </div>
                      <div className="text-sm font-bold text-indigo-950">
                        {otherParticipant.name || "Peer"} ({otherParticipant.email})
                      </div>
                    </div>
                  )}

                  {/* STAR RATING PICKER */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Your Rating (1 to 5 Stars) *
                    </label>
                    <div className="mt-1.5 flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const filled = (hoverRating || rating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="text-2xl transition hover:scale-110 focus:outline-none"
                            aria-label={`Rate ${star} star`}
                          >
                            <span className={filled ? "text-amber-400" : "text-slate-300"}>
                              ★
                            </span>
                          </button>
                        );
                      })}
                      <span className="ml-2 text-sm font-bold text-slate-700">
                        {hoverRating || rating} / 5
                      </span>
                    </div>
                  </div>

                  {/* COMMENT */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Feedback / Comment (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="How was your learning exchange? Did they explain concepts clearly?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !selectedBookingId}
                    className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Review ⭐"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* REVIEWS RECEIVED */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-bold text-slate-900">
                  Reviews You Received
                </h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
                  {receivedReviews.length} total
                </span>
              </div>

              {loading ? (
                <div className="py-8 text-center text-slate-500 text-sm">
                  Loading reviews...
                </div>
              ) : receivedReviews.length === 0 ? (
                <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-8 text-center">
                  <p className="text-sm text-slate-600">
                    No reviews received yet.
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Once you complete sessions with peers, their feedback will show up here.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {receivedReviews.map((r) => (
                    <div
                      key={r._id}
                      className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-slate-900">
                          {r.fromUser?.name || "Peer"}
                        </div>
                        <div className="flex text-amber-400 text-sm">
                          {"★".repeat(r.rating)}
                          {"☆".repeat(5 - r.rating)}
                        </div>
                      </div>

                      {r.comment && (
                        <p className="mt-2 text-xs text-slate-700 leading-relaxed italic">
                          "{r.comment}"
                        </p>
                      )}

                      <div className="mt-2 text-[10px] text-slate-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Reviews;
