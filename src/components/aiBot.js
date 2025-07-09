"use client";

import { useState } from "react";

export default function AIBot() {
  const [input, setInput] = useState("");
  // const [reply, setReply] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    const userMsg = input;
    setInput("");
    setMsgs((item) => [...item, { role: "user", content: userMsg }]);
    setLoading(true);
    const res = await fetch("/api/ollama", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input }),
    });
    const data = await res.json();
    setMsgs((item) => [...item, { role: "ai", content: data.response }]);
    setLoading(false);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="what would like to talk..."
      ></textarea>
      <button onClick={handleAskAI}>ask AI</button>
      <div>
        {msgs.map((item, index) => {
          return (
            <div
              key={index}
              className={item.role === "user" ? "bg-white" : "bg-amber-200"}
            >
              <span> {item.content}</span>
            </div>
          );
        })}
        {loading && <p className="text-gray-500 mt-2">AI is thinking...</p>}
      </div>
    </div>
  );
}
