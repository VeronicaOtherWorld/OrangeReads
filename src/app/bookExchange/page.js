"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import PostCard from "@/components/postCard";
import BookPostModal from "@/components/bookPostModal";
import toast, { Toaster } from "react-hot-toast";
import myAxios from "@/lib/myAxios";
import useUser from "@/hooks/useUser";

export default function BookExchange() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  // get method, get all posts from db
  const [posts, setPosts] = useState([]);

  const { user } = useUser();

  useEffect(() => {
    fetchPosts();
  }, []);

  // fetch posts
  const fetchPosts = async () => {
    try {
      const res = await myAxios.get("/posts/getPosts");
      setPosts(res.data);
    } catch (error) {
      console.error(error);
      toast.error("failed to load post");
    }
  };

  const handleCreate = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  // const handleEdit = (post) => {
  //   setEditingPost(post);
  //   setIsModalOpen(true);
  // };

  const handleSubmit = async ({ title, postContent, img }) => {
    console.log("title", title);
    console.log("postContent", postContent);
    console.log("img", img);
    if (!user) {
      toast.error("please login before posting");
      return;
    }

    try {
      const res = await myAxios.post("/posts/putPost", {
        title,
        postContent,
        img,
      });
      if (res.status !== 200) {
        toast.error("fail to post: " + res.data?.error);
        return;
      }
      toast.success("post successfully!");
      //fetch posts
      // rerender posts
      fetchPosts();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("sth went wrong");
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
