"use client";

import { useState } from "react";
import myAxios from "@/lib/myAxios";
import useUser from "@/hooks/useUser";

export default function AIBot() {
  // get login info
  const { user } = useUser();

  // input msg
  const [input, setInput] = useState("");
  // const [reply, setReply] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    const userMsg = input.trim();
    setInput("");
    setMsgs((item) => [...item, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const res = await myAxios.post("/ollama", {
        prompt: userMsg,
        userId: user.userId,
      });
      setMsgs((item) => [...item, { role: "ai", content: res.data.response }]);
    } catch (error) {
      setMsgs((prev) => [
        ...prev,
        { role: "ai", content: "something went wrong" },
      ]);
    } finally {
      setLoading(false);
    }

    setLoading(false);
  };

  // is not login, ask user to login at first
  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center text-red-500">
        Please login to use AI Bot.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="what would like to talk..."
        className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        rows={3}
      ></textarea>
      <button
        onClick={handleAskAI}
        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
      >
        ask AI
      </button>
      <div className="flex flex-col items-start space-y-3 mt-4">
        {msgs.map((item, index) => {
          return (
            <div
              key={index}
              className={`max-w-[80%] px-4 py-2 rounded-md text-sm whitespace-pre-wrap ${
                item.role === "user"
                  ? "bg-green-200 self-end ml-auto text-black"
                  : "bg-yellow-200 self-start mr-auto text-black"
              }`}
            >
              {item.content}
            </div>
          );
        })}
        {loading && <p className="text-gray-500 mt-2">AI is thinking...</p>}
      </div>
    </div>
  );
}
