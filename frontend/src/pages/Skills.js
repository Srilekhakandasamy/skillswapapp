import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Skills() {


  const [skills, setSkills] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("General");

  // ✅ STORE GOAL PER CARD
  const [formData, setFormData] = useState({});

  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // ✅ GET USER ID
  let userId = "";

  if (token) {

    try {

      userId = JSON.parse(
        atob(token.split(".")[1])
      ).id;

    } catch (err) {

      console.log("Token error");
    }
  }

  // ✅ FETCH SKILLS
  const fetchSkills = async () => {

    try {

      const res = await api.get(
        "/skills"
      );

      setSkills(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  // ✅ ADD SKILL
  const addSkill = async () => {

    try {

      await api.post(
        "/skills",
        {
          title,
          description,
          type,
          contactEmail: formData.contactEmail || "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Skill added ✅");

      setTitle("");
      setDescription("");
      setType("General");

      fetchSkills();

    } catch (err) {

      console.log(err);

      alert("Error adding skill ❌");
    }
  };

  // ✅ HANDLE GOAL INPUT
  const handleGoalChange = (
    skillId,
    value
  ) => {

    setFormData((prev) => ({
      ...prev,

      [skillId]: value,
    }));
  };

  // ✅ SEND REQUEST
  const sendRequest = async (
    receiverId,
    skillOfferedId,
    skillRequestedId,
    goal,
  ) => {
    try {
      if (!goal) {
        alert("Enter session goal ❌");
        return;
      }

      // booking payload now matches backend contract
      await api.post(
        "/bookings",
        {
          receiverId,
          skillOfferedId,
          skillRequestedId,
          sessionGoal: goal,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Request sent 🔥");

      // clear goal input for that requested skill
      setFormData((prev) => ({
        ...prev,
        [skillRequestedId]: "",
      }));
    } catch (err) {
      console.log(err);
      alert("Error sending request ❌");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchSkills();
  }, [token, navigate]);

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

        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#333"
          }}
        >
          Skill Swap Platform 🚀
        </h1>

        {/* ✅ ADD SKILL CARD */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginBottom: "30px"
          }}
        >

          <h2>Add New Skill</h2>

          <input
            value={title}

            placeholder="Skill title"

            onChange={(e) =>
              setTitle(e.target.value)
            }


            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />

          <input
            value={description}

            placeholder="Description"

            onChange={(e) =>
              setDescription(e.target.value)
            }

            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />

          <input
            value={type}

            placeholder="Type (e.g. React, Design, Marketing)"

            onChange={(e) =>
              setType(e.target.value)
            }

            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />

          <input
            placeholder="Contact email (for sharing & meeting)"
            value={formData.contactEmail || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />


          <button
            onClick={addSkill}

            style={{
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Add Skill
          </button>

        </div>

        {/* ✅ SHOW SKILLS */}
        {skills.length === 0 ? (

          <p>No skills found</p>

        ) : (

          skills.map((skill) => (

            <div
              key={skill._id}

              style={{
                background: "white",
                padding: "20px",
                marginBottom: "20px",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >

              {/* ✅ TITLE */}
              <h2
                style={{
                  color: "#2563eb"
                }}
              >
                {skill.title}
              </h2>

              {/* ✅ DESCRIPTION */}
              <p>
                {skill.description}
              </p>

              {/* ✅ USER */}
              <p>
                <b>Posted by:</b>{" "}
                {skill.user?.name}
              </p>

              {/* ⭐ RATING */}
              <p>
                ⭐ {skill.user?.rating || 0}
                ({skill.user?.totalReviews || 0} reviews)
              </p>

              {/* ✅ HIDE OWN SKILL */}
              {skill.user?._id !== userId && (
                <>

                  {/* ✅ SESSION GOAL */}
                  <input
                    value={
                      formData[skill._id] || ""
                    }

                    placeholder="What do you want to learn?"

                    onChange={(e) =>
                      handleGoalChange(
                        skill._id,
                        e.target.value
                      )
                    }

                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc"
                    }}
                  />

                  <br />
                  <br />

                  {/* ✅ REQUEST BUTTON */}
                  <button
                    onClick={() =>
                      sendRequest(
                        skill.user?._id, // receiverId = skill owner (other user)
                        // TODO (UI improvement): user should choose an offered skill.
                        // For now we reuse the same skill card (keeps flow working).
                        skill._id,
                        // you want the skill on this card
                        skill._id,
                        formData[skill._id] // session goal
                      )
                    }

                    style={{
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    Request
                  </button>


                </>
              )}

            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default Skills;