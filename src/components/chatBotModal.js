"sue client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function ChatBotModal({
  isOpen,
  onClose,
  onOpen,
  messages,
  onSendMessage,
}) {
  useEffect(() => {
    if (isOpen) {
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
            className="fixed bottom-4 right-4 z-40 w-12 h-12 bg-amber-200 rounded-full shadow-lg text-white text-lg flex items-center justify-center"
          >
            💬
          </button>
        )}
        {/* chat modal*/}
        {isOpen && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="w-[330px] h-[600px] bg-white rounded-2xl flex flex-col shadow-lg border">
              {/*header*/}
              <div className="bg-black text-white font-bold text-lg p-4 rounded-t-3xl flex justify-between items-center">
                <span>Ttile</span>
                <button onClick={onClose}>X</button>
              </div>
              {/*message*/}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.from === "bot" ? "justify-start" : "justify-end"
                    }`}
                  >
                    {msg.from === "bot" ? (
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-200 flex items-center justify-center">
                          robot
                        </div>
                        <div className="bg-gray-200 px-3 py-2 rounded-lg max-w-[70%]">
                          {msg.text}
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end items-end gap-2">
                        {/* bubble */}
                        <div className="bg-green-200 text-black px-4 py-2 rounded-xl max-w-sm w-fit whitespace-pre-wrap break-words">
                          {msg.text}
                        </div>
                        {/* avatar */}
                        <img
                          src="/your-avatar.png"
                          alt="User"
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/*input*/}

              <div className=" p-3 border-t">
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
                  className="flex items-center gap-2 border rounded-full px-4 py-2"
                >
                  <input
                    type="text"
                    name="message"
                    placeholder="enter your message"
                    className="flex-1 outline-none text-sm"
                  ></input>
                  <button type="submit" className="text-orange-600">
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
