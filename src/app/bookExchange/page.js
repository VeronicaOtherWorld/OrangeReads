"use client";
import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PostCard from "@/components/postCard";
import BookPostModal from "@/components/bookPostModal";
import toast, { Toaster } from "react-hot-toast";
const posts = [
  {
    id: 1,
    title: "Looking to swap '1984' for 'Brave New World'",
    description:
      "Good condition copy of Orwell's '1984'. Hoping to find a swap for Huxley's novel.",
  },
  {
    id: 2,
    title: "Looking to swap 'litte prince' for 'new world'",
    description: "I live in Dublin, looking forward change it in person",
  },
  {
    id: 3,
    title: "Looking to swap '1984' for 'Brave New World'",
    description:
      "Good condition copy of Orwell's '1984'. Hoping to find a swap for Huxley's novel.",
  },
  {
    id: 4,
    title: "Looking to swap 'litte prince' for 'new world'",
    description: "I live in Dublin, looking forward change it in person",
  },
];

export default function BookExchange() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const handleCreate = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  // const handleEdit = (post) => {
  //   setEditingPost(post);
  //   setIsModalOpen(true);
  // };

  const handleSubmit = async ({ title, description, img }) => {
    console.log("submit", title);
    console.log("submit", description);
    console.log("submit", img);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, img }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error("Failed to post: " + err.error);
        return;
      } else {
        toast.success("Post created successfully");
      }
      const result = await res.json();
      console.log("posted", result);
    } catch (error) {
      console.error(error);
    }
    setIsModalOpen(false);
  };
  return (
    <div className="min-h-screen">
      <Header />
      <title> book exchange posts </title>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">book exchange posts</h1>
          <div className="mb-8">
            <button
              onClick={handleCreate}
              className="px-4 bg-amber-400 text-white rounded hover:bg-amber-700"
            >
              + post
            </button>
          </div>
          <div className="text-gray-600">
            browse posts from other readers looking to swap books.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {posts.map((item) => (
              <PostCard key={item.id} post={item}></PostCard>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      {/* post modal */}
      {isModalOpen && (
        <BookPostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={editingPost}
          onSubmit={handleSubmit}
        ></BookPostModal>
      )}
    </div>
  );
}
