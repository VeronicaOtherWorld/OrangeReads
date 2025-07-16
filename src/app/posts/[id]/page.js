"use client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
export default function PostDetail() {
  const params = useParams();
  const id = params?.id;
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setPost(data);
      });
  }, [params.id]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!post) return <div className="p-4">Loading...</div>;
  return (
    <>
      <Header></Header>
      <div className="max-w-2xl mx-auto p-6">
        {post.img && (
          <img
            src={post.img}
            alt="img"
            className="w-full object-cover rounded-lg mb-4"
          ></img>
        )}
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <div>{post.postContent}</div>
        <button className="px-4 py-2 bg-amber-500 rounded text-white">
          Reply
        </button>
      </div>
      <Footer />
    </>
  );
}
