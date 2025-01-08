import React, { useState } from "react";
import axios from "../config/axiosInstance";
import "./AIAsk.css";
import { marked } from "marked";
import Swal from "sweetalert2";

const AIAsk = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);

  const handleAsk = async () => {
    if (!prompt) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Please enter a question!",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await axios({
        method: "post",
        url: "/gemini-ask",
        data: { promptUser: prompt },
      });

      setResponse(res.data);
    } catch (err) {
      setError("Failed to get response from the AI.");
      console.error("Error:", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to get response from the AI.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-ask-container">
      <h2>AI-Ask: Greeting</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Welcome to the world of Pokemon"
        rows="4"
        cols="50"
      />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? "Loading..." : "Ask AI"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {response && (
        <div
          className="ai-response"
          dangerouslySetInnerHTML={{ __html: marked(response) }} // Mengonversi Markdown ke HTML
        />
      )}
    </div>
  );
};

export default AIAsk;
