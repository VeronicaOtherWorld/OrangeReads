"use client";
import { useEffect, useState } from "react";

export default function ChatBotModal({
  isOpen,
  onClose,
  onOpen,
  messages,
  onSendMessage,
  setMessages,
}) {
  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        setMessages([
          {
            from: "bot",
            text: "Hey reader! Curious about any book? I’ve got stories to tell.",
          },
        ]);
      }
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  return (
    <>
      <div>
        {/*close the chat*/}
        {!isOpen && (
          <button
            onClick={onOpen}
            className="fixed cursor-pointer bottom-4 right-4 z-40 w-12 h-12 bg-amber-200 rounded-full shadow-lg text-white text-lg flex items-center justify-center"
          >
            💬
          </button>
        )}
        {/* chat modal*/}
        {isOpen && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="w-[330px] h-[600px] bg-white rounded-2xl flex flex-col shadow-lg overflow-hidden">
              {/*header*/}
              <div className="bg-orange-500 text-white font-bold text-lg p-4 rounded-t-2xl flex justify-between items-center">
                <span>Ask AI Bot</span>
                <button onClick={onClose}>X</button>
              </div>
              {/*message*/}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.from === "bot" ? "justify-start" : "justify-end"
                    }`}
                  >
                    {msg.from === "bot" ? (
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-full bg-green-100 text-xs font-semibold flex items-center justify-center text-black">
                          🤖
                        </div>
                        <div
                          className={`${
                            msg.text === "typing..."
                              ? "italic text-gray-500 bg-green-100"
                              : "bg-green-200"
                          } text-black px-4 py-2 rounded-xl max-w-[70%] whitespace-pre-wrap break-words`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end items-center gap-2">
                        <div className="bg-yellow-100 text-black px-4 py-2 rounded-xl max-w-sm w-fit whitespace-pre-wrap break-words">
                          {msg.text}
                        </div>
                        <div className="w-7 h-7 rounded-full bg-yellow-300 object-cover shrink-0 flex items-center justify-center">
                          🍊
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/*input*/}

              <div className="p-3 border-t border-gray-200">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.target.message;
                    const trimmedVal = input.value.trim();
                    if (trimmedVal) {
                      onSendMessage(trimmedVal);
                      input.value = "";
                    }
                  }}
                  className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 shadow-sm"
                >
                  <input
                    type="text"
                    name="message"
                    placeholder="enter your message"
                    className="flex-1 outline-none text-sm"
                  ></input>
                  <button
                    type="submit"
                    className="text-orange-600 cursor-pointer"
                  >
                    submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
