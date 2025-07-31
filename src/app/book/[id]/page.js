"use client";
import { use, useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ChatBotModal from "@/components/chatBotModal";
import { useParams, useSearchParams } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import toast from "react-hot-toast";
import myAxios from "@/lib/myAxios";
import useUser from "@/hooks/useUser";
import ollamaAxios from "@/lib/ollamaAxios";

const ReadingMap = dynamic(() => import("@/components/map"), { ssr: false });

export default function BookDetailPage() {
  const { user } = useUser();
  const params = useSearchParams();
  const route = useParams();

  const addToCart = useCartStore((state) => state.addToCart);

  const handleAdd = () => {
    addToCart(book);
    //toast
    toast.success(`successfully added ${book.title} to your cart`);
  };

  const book = {
    id: route.id,
    title: params.get("title"),
    author: params.get("author"),
    nationality: params.get("nationality"),
    price: parseFloat(params.get("price")),
    cover: decodeURIComponent(params.get("cover")),
    description: params.get("description"),
  };
  const [expanded, setExpanded] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (userMsg) => {
    if (!user) {
      toast.error("Please login to use the AI bot");
      return;
    }

    setMessages((prev) => [
      ...prev,
      { from: "user", text: userMsg },
      { from: "bot", text: "typing..." },
    ]);

    try {
      const res = await ollamaAxios.post("/ollama", {
        prompt: userMsg,
        userId: user?.userId,
        bookId: book.id,
        content: "book-page",
        promptType: "user",
      });

      const aiText =
        res.data.response?.trim() || "Sorry, I didn't get a proper response.";
      setMessages((prev) => {
        const updated = [...prev];
        // remove "typing..."
        updated.pop();
        return [...updated, { from: "bot", text: aiText }];
      });
    } catch (error) {
      setMessages((prev) => {
        const updated = [...prev];
        // remove "typing..."
        updated.pop();
        return [
          ...updated,
          { from: "bot", text: "Sorry, I couldn't get a response." },
        ];
      });
    }
  };

  return (
    <>
      <Header></Header>
      <div className="flex justify-center px-4 py-16">
        <div className="w-full max-w-[1200px] px-6 mx-auto">
          <div className="flex flex-col gap-12 px-2 mb-18">
            {/* Cover + Info */}
            <div className="flex flex-col md:flex-row items-center md:items-center">
              {/* Cover */}
              <div className="w-full md:w-1/2 flex justify-center">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full max-w-xs aspect-[2/3] object-cover rounded shadow"
                />
              </div>

              {/* Info */}
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-3">
                <div className="w-full flex justify-center md:justify-start">
                  <div className="w-full max-w-xs flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">{book.title}</h1>
                    <p className="text-gray-700 text-sm">
                      AUTHOR: {book.author}
                    </p>
                    <p className="text-gray-700 text-sm">
                      NATIONALITY: {book.nationality}
                    </p>
                    <p className="text-lg font-semibold mt-2">
                      €{book.price.toFixed(2)}
                    </p>
                    <button
                      className="self-center md:self-start mt-1 px-4 py-2 bg-black text-white text-sm rounded-md cursor-pointer"
                      onClick={handleAdd}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Ask AI + Overview */}
            <div className="flex flex-col md:flex-row items-center md:items-center gap-8">
              {/* Ask AI */}
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="text-center">
                  <p className="font-medium text-sm">
                    Ask AI: Will I enjoy <i>{book.title}</i>?
                  </p>
                  <button
                    onClick={() => setChatOpen(true)}
                    className="mt-2 px-6 py-2 bg-gray-800 text-white text-sm rounded-md"
                  >
                    START A NEW CHAT
                  </button>
                </div>
              </div>

              {/* Overview */}
              <div className="w-full md:w-1/2 md:pr-8">
                <div className="max-w-prose text-left">
                  <h2 className="font-semibold">OVERVIEW</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {expanded
                      ? book.description
                      : book.description.slice(0, 300) +
                        (book.description.length > 300 ? "..." : "")}
                  </p>
                  {book.description.length > 300 && (
                    <button
                      className="text-orange-400 text-sm mt-2"
                      onClick={() => setExpanded((prev) => !prev)}
                    >
                      {expanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Reading Map 
          <div>
            <h2 className="text-xl font-bold text-center">Your reading map</h2>
            <div className="bg-slate-400 h-48 rounded-xl flex items-center justify-center text-white">
              <ReadingMap />
            </div>
          </div>
          */}
        </div>
      </div>

      {/* chat bot*/}
      <ChatBotModal
        isOpen={isChatOpen}
        onOpen={() => setChatOpen(true)}
        onClose={() => setChatOpen(false)}
        messages={messages}
        setMessages={setMessages}
        onSendMessage={handleSendMessage}
      ></ChatBotModal>
      <Footer />
    </>
  );
}
