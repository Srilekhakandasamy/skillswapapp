import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getUserId, getToken } from "../services/authService";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [mySkills, setMySkills] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = getToken();
  const userId = getUserId();

  const fetchData = async () => {
    try {
      setLoading(true);

      const [profileRes, skillsRes, bookingRes, matchRes] = await Promise.all([
        api.get("/auth/me").catch(() => ({ data: { user: null } })),
        api.get("/skills/me").catch(() => ({ data: [] })),
        api.get("/bookings").catch(() => ({ data: [] })),
        api.get("/skills/match").catch(() => ({ data: [] })),
      ]);

      setProfile(profileRes.data?.user || null);
      setMySkills(skillsRes.data || []);
      setBookings(bookingRes.data || []);
      setMatches(matchRes.data || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
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

  const offers = mySkills.filter((s) => s.postType === "offer");
  const requests = mySkills.filter((s) => s.postType === "request");
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const activeCount = bookings.filter((b) => b.status === "accepted" && !b.completed).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* WELCOME BANNER */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
                <span>⚡ SkillSwap Dashboard</span>
              </div>
              <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Welcome back, {profile?.name || "Friend"}! 👋
              </h1>
              <p className="mt-1 text-sm text-indigo-100">
                {profile?.email}
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4 backdrop-blur">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  ⭐ {profile?.rating ? profile.rating.toFixed(1) : "0.0"}
                </div>
                <div className="text-xs text-indigo-200">
                  {profile?.totalReviews || 0} reviews
                </div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <Link
                to="/skills"
                className="rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
              >
                + Post Skill
              </Link>
            </div>
          </div>

          {/* STATS ROW */}
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/20 pt-6 sm:grid-cols-4">
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
              <div className="text-xl font-black">{offers.length}</div>
              <div className="text-xs text-indigo-200">Skills I Offer</div>
            </div>
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
              <div className="text-xl font-black">{requests.length}</div>
              <div className="text-xs text-indigo-200">Skills I Want</div>
            </div>
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
              <div className="text-xl font-black">{activeCount + pendingCount}</div>
              <div className="text-xs text-indigo-200">Active Bookings</div>
            </div>
            <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
              <div className="text-xl font-black">{matches.length}</div>
              <div className="text-xs text-indigo-200">Mutual Matches 🔥</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">
            Loading your dashboard...
          </div>
        ) : (
          <div className="space-y-8">
            {/* MUTUAL MATCHES SECTION */}
            <section className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                    <span className="text-xl">🔥</span>
                    Mutual Skill Matches
                  </h2>
                  <p className="text-xs text-slate-500">
                    Users who offer what you want to learn AND want what you teach!
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  {matches.length} matched
                </span>
              </div>

              {matches.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                  <p className="text-sm text-slate-600">
                    No mutual matches yet.
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Try posting an offered skill and a requested skill in the Skills page to get matched automatically!
                  </p>
                  <Link
                    to="/skills"
                    className="mt-3 inline-block rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    Go to Skills
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {matches.map((user) => (
                    <div
                      key={user._id}
                      className="flex flex-col justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm transition hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="rounded-full bg-emerald-200/70 px-2 py-0.5 text-[11px] font-bold text-emerald-900">
                            ✨ Perfect Match
                          </span>
                          <span className="text-xs font-bold text-amber-600">
                            ⭐ {user.rating ? user.rating.toFixed(1) : "0.0"}
                          </span>
                        </div>
                        <h3 className="mt-2 text-base font-bold text-slate-900">
                          {user.name}
                        </h3>
                        <p className="text-xs text-slate-600">
                          {user.email}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          {user.totalReviews || 0} reviews
                        </span>
                        <Link
                          to="/skills"
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                        >
                          Request Swap →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* MY SKILLS SECTION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    📘 My Skills
                  </h2>
                  <p className="text-xs text-slate-500">
                    Skills you offer to teach and skills you want to learn.
                  </p>
                </div>
                <Link
                  to="/skills"
                  className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                >
                  Manage Skills
                </Link>
              </div>

              {mySkills.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                  <p className="text-sm text-slate-600">You haven't posted any skills yet.</p>
                  <Link
                    to="/skills"
                    className="mt-3 inline-block rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    Add Your First Skill
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {mySkills.map((s) => {
                    const isOffer = s.postType === "offer";
                    return (
                      <div
                        key={s._id}
                        className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                isOffer
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {isOffer ? "Offering to Teach" : "Wanting to Learn"}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500">
                              {s.level || "Beginner"}
                            </span>
                          </div>

                          <h3 className="mt-2 text-base font-bold text-slate-900">
                            {s.title}
                          </h3>
                          <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                            {s.description}
                          </p>

                          {s.tags && s.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {s.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-2 text-[11px] text-slate-400 border-t border-slate-100">
                          Category: {s.type || "General"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* MY RECENT BOOKINGS */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    📚 My Swap Sessions
                  </h2>
                  <p className="text-xs text-slate-500">
                    Recent swap requests and learning sessions.
                  </p>
                </div>
                <Link
                  to="/bookings"
                  className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                >
                  View All Bookings
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                  <p className="text-sm text-slate-600">No swap sessions yet.</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Find a peer on the Skills page and click "Request Swap" to get started!
                  </p>
                  <Link
                    to="/skills"
                    className="mt-3 inline-block rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                  >
                    Browse Skills
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((b) => {
                    const isSender = (b.senderId?._id || b.senderId)?.toString() === userId?.toString();
                    const partner = isSender ? b.receiverId : b.senderId;

                    return (
                      <div
                        key={b._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition hover:bg-slate-50"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {isSender ? "Sent to:" : "Received from:"} {partner?.name || partner?.email || "User"}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                b.completed
                                  ? "bg-blue-100 text-blue-800"
                                  : b.status === "accepted"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : b.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {b.completed ? "Completed" : b.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="mt-1 text-xs text-slate-600">
                            <b>Goal:</b> {b.sessionGoal}
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            <b>Skill:</b> {b.skillRequestedId?.title || "Skill"}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to="/bookings"
                            className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                          >
                            Details →
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;