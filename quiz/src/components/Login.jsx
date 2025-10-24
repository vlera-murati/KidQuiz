import React, { useState, useEffect } from "react";
import { createApi, endpoints } from "../api";
import useStateContext from "../hooks/useStateContext";
import { useNavigate } from "react-router-dom";

const participantApi = createApi(endpoints.participant);

export default function Login() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({});
  const [participants, setParticipants] = useState([]);

  const { context, setContext, resetContext, playAudio } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const response = await participantApi.fetch();
        setParticipants(response.data);
        console.log("Loaded participants:", response.data);
      } catch (error) {
        console.error("Error loading participants:", error);
      }
    };
    loadParticipants();
  }, []);

  const handelChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    resetContext();
  }, []);

  const handelLogin = async (e) => {
    e.preventDefault();

    let tempErrors = {};
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name) tempErrors.name = "Name is required";
    else if (!nameRegex.test(form.name))
      tempErrors.name = "Name can only contain letters and spaces";

    if (!form.email) tempErrors.email = "Email is required";
    else if (!emailRegex.test(form.email))
      tempErrors.email = "Email is invalid";

    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) return;

    try {
      let participant = participants.find(
        (p) => p.email.toLowerCase() === form.email.toLowerCase()
      );

      if (participant) {
        setContext({ participantId: participant.participantId });
        console.log("Existing participant:", participant);
        alert(`Welcome back ${participant.name}!`);
      } else {
        const res = await participantApi.post({
          name: form.name,
          email: form.email,
          score: 0,
          timeTaken: 0,
        });

        participant = res.data;
        setContext({ participantId: participant.participantId });
        setParticipants((prev) => [...prev, participant]);
        console.log("New participant created:", participant);
        alert(`Welcome ${form.name}!`);
      }

      playAudio("/sound/Song.mp3");
      setForm({ name: "", email: "" });

      // ✅ Vetëm kjo linjë për navigim
      navigate("/quiz");
    } catch (error) {
      console.error("Error during login/register:", error);
      alert("Error while saving or loading participant");
    }
  };

  return (
    <section className="max-w-md p-8 mx-auto bg-gradient-to-br from-pink-300 via-yellow-200 to-purple-300 rounded-2xl shadow-2xl mt-20 relative">
      <div className="text-6xl animate-bounce text-center mb-4">🐵</div>
      <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">
        QUIZ APP
      </h2>

      <form onSubmit={handelLogin}>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-white font-semibold mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handelChange}
              placeholder="Your name"
              className="block w-full px-4 py-3 rounded-xl border-2 border-white bg-white/70 text-gray-800 font-medium placeholder-gray-500 focus:border-pink-500 focus:ring focus:ring-pink-300 focus:ring-opacity-50 outline-none transition-all"
            />
            {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-white font-semibold mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handelChange}
              placeholder="you@example.com"
              className="block w-full px-4 py-3 rounded-xl border-2 border-white bg-white/70 text-gray-800 font-medium placeholder-gray-500 focus:border-yellow-400 focus:ring focus:ring-yellow-300 focus:ring-opacity-50 outline-none transition-all"
            />
            {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="px-10 py-3 text-lg font-bold text-white bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
          >
            Save
          </button>
        </div>
      </form>

      <div className="mt-8 bg-white/50 p-4 rounded-xl shadow-inner">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          Participants List
        </h3>
        <ul>
          {participants.map((p) => (
            <li key={p.participantId} className="text-gray-900">
              {p.name} - {p.email} (Score: {p.score})
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
