import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getUserId, getToken } from "../services/authService";
import Navbar from "../components/Navbar";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'pending' | 'accepted' | 'completed'

  const [meetingDateById, setMeetingDateById] = useState({});
  const [meetingLinkById, setMeetingLinkById] = useState({});
  const [meetingMessageById, setMeetingMessageById] = useState({});
  const [savingMeetingId, setSavingMeetingId] = useState(null);

  const token = getToken();
  const userId = getUserId();
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings");
      setBookings(res.data || []);
    } catch (err) {
      console.error("Fetch bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAccept = async (id) => {
    try {
      await api.put(`/bookings/${id}`, { status: "accepted" });
      alert("Swap request accepted! 🎉");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error accepting request ❌");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to decline this request?")) return;
    try {
      await api.put(`/bookings/${id}`, { status: "rejected" });
      alert("Request declined.");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error declining request ❌");
    }
  };

  const handleCompleteSession = async (id) => {
    try {
      await api.put(`/bookings/${id}/complete`, { goalCompleted: true });
      alert("Session marked as completed! 🎓 You can now write a review.");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error completing session ❌");
    }
  };

  const handleSaveMeetingDetails = async (id) => {
    try {
      setSavingMeetingId(id);
      await api.put(`/bookings/${id}/meeting`, {
        meetingDate: meetingDateById[id] || undefined,
        meetingLink: meetingLinkById[id] || undefined,
        meetingMessage: meetingMessageById[id] || undefined,
      });
      alert("Meeting details saved successfully! 📅");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving meeting details ❌");
    } finally {
      setSavingMeetingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "pending") return b.status === "pending" && !b.completed;
    if (activeTab === "accepted") return b.status === "accepted" && !b.completed;
    if (activeTab === "completed") return b.completed === true;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              My Swap Sessions 📚
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage incoming & outgoing swap requests, schedule sessions, and mark completion.
            </p>
          </div>

          <Link
            to="/skills"
            className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
          >
            + New Swap Request
          </Link>
        </div>

        {/* TABS */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          {[
            { id: "all", label: `All (${bookings.length})` },
            { id: "pending", label: `Pending (${bookings.filter((b) => b.status === "pending" && !b.completed).length})` },
            { id: "accepted", label: `Active (${bookings.filter((b) => b.status === "accepted" && !b.completed).length})` },
            { id: "completed", label: `Completed (${bookings.filter((b) => b.completed).length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* LIST */}
        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading your bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <p className="text-base font-semibold text-slate-700">
              No sessions found in this category.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              When you or other peers send a swap request, it will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {filteredBookings.map((b) => {
              const senderId = (b.senderId?._id || b.senderId)?.toString();
              const receiverId = (b.receiverId?._id || b.receiverId)?.toString();
              const isSender = senderId === userId?.toString();
              const isReceiver = receiverId === userId?.toString();
              const partner = isSender ? b.receiverId : b.senderId;

              const statusColor = b.completed
                ? "bg-blue-100 text-blue-800"
                : b.status === "accepted"
                ? "bg-emerald-100 text-emerald-800"
                : b.status === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-amber-100 text-amber-800";

              return (
                <div
                  key={b._id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  {/* TOP HEADER */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {isSender ? "Outgoing Swap to" : "Incoming Swap from"}:
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {partner?.name || partner?.email || "User"}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        Email: {partner?.email || "Not shared"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusColor}`}>
                        {b.completed ? "Completed 🎓" : b.status}
                      </span>
                    </div>
                  </div>

                  {/* BODY */}
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3.5">
                      <div className="text-xs font-semibold text-slate-500">
                        🎯 Requested Skill (To Learn)
                      </div>
                      <div className="mt-1 text-sm font-bold text-slate-900">
                        {b.skillRequestedId?.title || "Skill"}
                      </div>
                      <div className="text-xs text-slate-500">
                        Level: {b.skillRequestedId?.level || "Beginner"}
                      </div>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3.5">
                      <div className="text-xs font-semibold text-slate-500">
                        🔄 Offered Skill (In Exchange)
                      </div>
                      <div className="mt-1 text-sm font-bold text-slate-900">
                        {b.skillOfferedId?.title || "Direct exchange"}
                      </div>
                      <div className="text-xs text-slate-500">
                        Level: {b.skillOfferedId?.level || "Beginner"}
                      </div>
                    </div>

                    <div className="sm:col-span-2 rounded-xl border border-indigo-50 bg-indigo-50/40 p-3.5">
                      <div className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                        Session Goal:
                      </div>
                      <div className="mt-1 text-sm font-medium text-slate-800">
                        "{b.sessionGoal}"
                      </div>
                    </div>
                  </div>

                  {/* SAVED MEETING INFO */}
                  {(b.meetingDate || b.meetingLink || b.meetingMessage) && (
                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                      <div className="text-xs font-bold text-emerald-900 uppercase">
                        📅 Meeting Schedule & Link:
                      </div>
                      <div className="mt-2 space-y-1 text-xs text-slate-700">
                        {b.meetingDate && (
                          <div>
                            <b>Time:</b> {new Date(b.meetingDate).toLocaleString()}
                          </div>
                        )}
                        {b.meetingLink && (
                          <div>
                            <b>Link:</b>{" "}
                            <a
                              href={b.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="font-bold text-indigo-600 underline hover:text-indigo-800"
                            >
                              Join Session ({b.meetingLink})
                            </a>
                          </div>
                        )}
                        {b.meetingMessage && (
                          <div>
                            <b>Note:</b> {b.meetingMessage}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SENDER MEETING FORM (AFTER ACCEPTANCE) */}
                  {b.status === "accepted" && !b.completed && isSender && (
                    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <h4 className="text-xs font-bold text-slate-800 uppercase">
                        Set / Update Meeting Details (Zoom, Google Meet, or Schedule)
                      </h4>

                      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Date & Time
                          </label>
                          <input
                            type="datetime-local"
                            value={meetingDateById[b._id] ?? (b.meetingDate ? b.meetingDate.slice(0, 16) : "")}
                            onChange={(e) =>
                              setMeetingDateById((prev) => ({
                                ...prev,
                                [b._id]: e.target.value ? new Date(e.target.value).toISOString() : null,
                              }))
                            }
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-sm outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Meeting Link (Meet/Zoom)
                          </label>
                          <input
                            placeholder="https://meet.google.com/..."
                            value={meetingLinkById[b._id] ?? (b.meetingLink || "")}
                            onChange={(e) =>
                              setMeetingLinkById((prev) => ({ ...prev, [b._id]: e.target.value }))
                            }
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-sm outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-600">
                            Message / Agenda
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Share your availability, topics to cover, or agenda."
                            value={meetingMessageById[b._id] ?? (b.meetingMessage || "")}
                            onChange={(e) =>
                              setMeetingMessageById((prev) => ({ ...prev, [b._id]: e.target.value }))
                            }
                            className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-sm outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleSaveMeetingDetails(b._id)}
                          disabled={savingMeetingId === b._id}
                          className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {savingMeetingId === b._id ? "Saving..." : "Save Meeting Schedule"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="text-xs text-slate-400">
                      Created on: {new Date(b.createdAt || b.date).toLocaleDateString()}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* PENDING RECEIVER ACTIONS */}
                      {b.status === "pending" && isReceiver && (
                        <>
                          <button
                            onClick={() => handleAccept(b._id)}
                            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                          >
                            ✓ Accept Request
                          </button>
                          <button
                            onClick={() => handleReject(b._id)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
                          >
                            ✕ Decline
                          </button>
                        </>
                      )}

                      {/* ACCEPTED COMPLETION ACTION */}
                      {b.status === "accepted" && !b.completed && (isReceiver || isSender) && (
                        <button
                          onClick={() => handleCompleteSession(b._id)}
                          className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                          Mark Completed 🎓
                        </button>
                      )}

                      {/* COMPLETED REVIEW ACTION */}
                      {b.completed && (
                        <Link
                          to="/reviews"
                          className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-amber-600"
                        >
                          Rate & Review Partner ⭐
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Bookings;
