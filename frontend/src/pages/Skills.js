import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getUserId, getToken } from "../services/authService";
import Navbar from "../components/Navbar";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'offer' | 'request'
  const [searchTerm, setSearchTerm] = useState("");

  // Add Skill Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Web Development");
  const [postType, setPostType] = useState("offer");
  const [level, setLevel] = useState("Beginner");
  const [tagsInput, setTagsInput] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Request Swap Modal/State
  const [requestModalSkill, setRequestModalSkill] = useState(null);
  const [selectedOfferSkillId, setSelectedOfferSkillId] = useState("");
  const [sessionGoal, setSessionGoal] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);

  const token = getToken();
  const userId = getUserId();
  const navigate = useNavigate();

  const fetchSkillsData = async () => {
    try {
      setLoading(true);
      const [allRes, myRes] = await Promise.all([
        api.get("/skills"),
        api.get("/skills/me").catch(() => ({ data: [] })),
      ]);
      setSkills(allRes.data || []);
      setMySkills(myRes.data || []);
    } catch (err) {
      console.error("Error fetching skills:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchSkillsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Please provide both a title and description.");
      return;
    }

    try {
      setAddLoading(true);
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await api.post("/skills", {
        title: title.trim(),
        description: description.trim(),
        type: type.trim() || "General",
        postType,
        level,
        tags,
        contactEmail: contactEmail.trim(),
      });

      alert("Skill posted successfully! 🎉");
      setTitle("");
      setDescription("");
      setTagsInput("");
      setContactEmail("");
      setShowAddForm(false);
      fetchSkillsData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding skill ❌");
    } finally {
      setAddLoading(false);
    }
  };

  const openRequestModal = (targetSkill) => {
    setRequestModalSkill(targetSkill);
    // Auto-select user's first offered skill if available
    const myOffers = mySkills.filter((s) => s.postType === "offer");
    setSelectedOfferSkillId(myOffers[0]?._id || "");
    setSessionGoal("");
  };

  const handleSendRequest = async () => {
    if (!sessionGoal.trim()) {
      alert("Please describe what you want to achieve (Session Goal).");
      return;
    }

    try {
      setRequestLoading(true);
      await api.post("/bookings", {
        receiverId: requestModalSkill.user?._id,
        skillRequestedId: requestModalSkill._id,
        skillOfferedId: selectedOfferSkillId || undefined,
        sessionGoal: sessionGoal.trim(),
      });

      alert("Swap request sent successfully! 🚀 Check My Bookings for updates.");
      setRequestModalSkill(null);
      setSessionGoal("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error sending request ❌");
    } finally {
      setRequestLoading(false);
    }
  };

  // Filter skills
  const filteredSkills = skills.filter((s) => {
    const matchesTab = activeTab === "all" || s.postType === activeTab;
    const matchesSearch =
      searchTerm === "" ||
      s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.tags && s.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));

    return matchesTab && matchesSearch;
  });

  const myOffers = mySkills.filter((s) => s.postType === "offer");

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Explore Skills 💡
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Browse peer skills, propose swaps, or post skills you offer and want to learn.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <span>{showAddForm ? "✕ Cancel" : "+ Post a Skill"}</span>
          </button>
        </div>

        {/* ADD SKILL FORM (ACCORDION) */}
        {showAddForm && (
          <form
            onSubmit={handleAddSkill}
            className="mt-6 rounded-2xl border border-indigo-100 bg-white p-6 shadow-md"
          >
            <h2 className="text-lg font-bold text-slate-900">
              Share a New Skill
            </h2>
            <p className="text-xs text-slate-500">
              Select whether you are offering to teach or looking to learn.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Type of Post *
                </label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="offer">I can teach this (Skill Offer)</option>
                  <option value="request">I want to learn this (Skill Request)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Skill Level *
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Skill Title *
                </label>
                <input
                  required
                  placeholder="e.g. React & State Management, UI/UX in Figma, Spanish Conversation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="What will you teach or what are you looking to practice? Include topics and format."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Category / Subject
                </label>
                <input
                  placeholder="e.g. Web Development, Design, Language, Music"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Tags (comma separated)
                </label>
                <input
                  placeholder="React, JavaScript, Tailwind, Frontend"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Contact Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addLoading}
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {addLoading ? "Posting..." : "Publish Skill"}
              </button>
            </div>
          </form>
        )}

        {/* SEARCH & FILTER BAR */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* TABS */}
          <div className="flex rounded-xl bg-slate-200/70 p-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Skills ({skills.length})
            </button>
            <button
              onClick={() => setActiveTab("offer")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === "offer"
                  ? "bg-white text-indigo-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🎓 Offers ({skills.filter((s) => s.postType === "offer").length})
            </button>
            <button
              onClick={() => setActiveTab("request")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === "request"
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🙋 Requests ({skills.filter((s) => s.postType === "request").length})
            </button>
          </div>

          {/* SEARCH INPUT */}
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search skills, tags, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* SKILLS GRID */}
        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading skills...
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <p className="text-base font-semibold text-slate-700">
              No skills found matching your filter.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Be the first to post a skill in this category!
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredSkills.map((skill) => {
              const isOwner = (skill.user?._id || skill.user)?.toString() === userId?.toString();
              const isOffer = skill.postType === "offer";

              return (
                <div
                  key={skill._id}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div>
                    {/* TOP BADGES */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          isOffer
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {isOffer ? "Teaching / Offer" : "Seeking / Request"}
                      </span>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                        {skill.level || "Beginner"}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h2 className="mt-3 text-lg font-bold text-slate-900">
                      {skill.title}
                    </h2>

                    {/* DESCRIPTION */}
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      {skill.description}
                    </p>

                    {/* TAGS */}
                    {skill.tags && skill.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {skill.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FOOTER & ACTIONS */}
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {isOwner ? "You" : skill.user?.name || "Member"}
                        </div>
                        <div className="text-[11px] text-amber-600 font-semibold">
                          ⭐ {skill.user?.rating ? skill.user.rating.toFixed(1) : "0.0"} ({skill.user?.totalReviews || 0} reviews)
                        </div>
                      </div>

                      {isOwner ? (
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                          Your Post
                        </span>
                      ) : (
                        <button
                          onClick={() => openRequestModal(skill)}
                          className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                          Request Swap 🤝
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* REQUEST SWAP MODAL */}
        {requestModalSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  Request Skill Swap
                </h3>
                <button
                  onClick={() => setRequestModalSkill(null)}
                  className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="text-xs text-slate-500">You are requesting from:</div>
                  <div className="text-sm font-bold text-slate-900">
                    {requestModalSkill.user?.name} ({requestModalSkill.user?.email})
                  </div>
                  <div className="mt-1 text-xs text-indigo-700 font-semibold">
                    Skill: {requestModalSkill.title}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Which skill do you offer in exchange? (Optional)
                  </label>
                  {myOffers.length > 0 ? (
                    <select
                      value={selectedOfferSkillId}
                      onChange={(e) => setSelectedOfferSkillId(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="">-- No specific skill (General swap) --</option>
                      {myOffers.map((o) => (
                        <option key={o._id} value={o._id}>
                          {o.title} ({o.level || "Beginner"})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-1 text-xs text-slate-500">
                      You haven't posted any offered skills yet. You can still send a swap request!
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Session Goal * (What would you like to learn / achieve?)
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. I want to build a simple interactive React component together and learn hooks best practices."
                    value={sessionGoal}
                    onChange={(e) => setSessionGoal(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setRequestModalSkill(null)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendRequest}
                  disabled={requestLoading}
                  className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {requestLoading ? "Sending..." : "Send Request 🚀"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Skills;