"use client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import BookPostModal from "@/components/bookPostModal";
import useUser from "@/hooks/useUser";
import myAxios from "@/lib/myAxios";
import { useRouter } from "next/navigation";

export default function PostDetail() {
  const params = useParams();
  const id = params?.id;
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  //router
  const router = useRouter();

  // make sure login and the user is the poster

  const { user } = useUser();
  const isOwner = user?.userId === post?.posterId;

  // post modal
  const [editModalOpen, setEditModalOpen] = useState(false);

  // reply state
  const [replyMsg, setReplyMsg] = useState("");

  // comments state
  const [comments, setComments] = useState([]);

  // store reply user id
  const [replyToUserId, setReplyToUserId] = useState(null);

  // load post detail
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const res = await myAxios.get(`/posts/${id}`);
        const data = res.data;
        if (data.error) setError(data.error);
        else setPost(data);
      } catch (err) {
        setError("Failed to load post");
      }
    };
    fetchPost();
  }, [id]);

  // load comments, only onwer and poster can see
  const loadComments = async () => {
    if (!user || !id) {
      return;
    }

    try {
      const res = await myAxios.get(`/comments/${id}?userId=${user.userId}`);
      setComments(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    loadComments();
  }, [id, user]);

  // edit update post
  const handleUpdate = async (updatePost) => {
    try {
      await myAxios.put(`/posts/${post.id}`, updatePost);
      setPost(updatePost);
      const res = await fetch(`/api/posts/${post.id}`);
      const newPost = await res.json();
      setPost(newPost);
    } catch (error) {
      console.error(error);
    }
  };

  // delete post
  const handleDelete = async () => {
    if (!confirm("are you sure to delete this post?")) return;

    try {
      await myAxios.delete(`/posts/${post.id}`);
      router.push("/bookExchange");
    } catch (error) {}
  };

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
            className="w-32 h-auto object-cover rounded-lg mb-4 mx-auto"
          />
        )}

        {/* post */}
        <div className="mb-6">
          {/* title */}
          <h1 className="mt-12 mb-12 text-2xl font-bold text-center">
            {post.title}
          </h1>

          {/* onwer */}
          <div className="text-xs text-gray-500 mb-4">
            Posted by{" "}
            <span className="text-green-600 font-semibold">
              {post.posterId?.split("@")[0]}
            </span>{" "}
            on {new Date(post.createdAt).toLocaleString()}
          </div>

          {/* post content */}
          <div className="text-base leading-relaxed">{post.postContent}</div>
        </div>
        <div className=" border-b-4 border-amber-600 border-dotted pb-4">
          {/*  <button className="px-4 py-2 bg-amber-500 rounded text-white">
            Reply
          </button>
          */}
          {/*only display when the user is the owner of the post*/}

          {isOwner && (
            <div className="mt-4 flex justify-end">
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 text-sm bg-amber-500 text-white rounded"
                  onClick={() => setEditModalOpen(true)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 text-sm bg-amber-600 text-white rounded"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
        {/* write comments area*/}
        {user && (
          <div className="mt-6">
            <div className="flex gap-2 items-center">
              <textarea
                value={replyMsg}
                onChange={(e) => setReplyMsg(e.target.value)}
                placeholder="write your reply"
                className="flex-1 p-2 border border-amber-200 focus:border-amber-500 rounded resize-none h-20 focus:outline-none"
              />
              <button
                className="px-4 py-2 bg-amber-500 text-white rounded self-center cursor-pointer"
                onClick={async () => {
                  if (!replyMsg) return;
                  const targetId = replyToUserId ?? post.posterId;
                  try {
                    await myAxios.post("/comments", {
                      postId: post.id,
                      userId: user.userId,
                      msg: replyMsg,
                      visibleTo: [user.userId, targetId],
                    });
                    setReplyMsg("");
                    // clean the reply user id
                    setReplyToUserId(null);
                    await loadComments();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}
        {/* display the comments */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">comments</h2>
          {comments.map((item, index) => {
            const canView = item.visibleTo.includes(user?.userId);
            const nickname = item.userId?.split("@")[0] || "Anonymous";
            const time = new Date(item.time).toLocaleString();

            return (
              <div key={index} className="border-b border-amber-400 py-3">
                <div className="text-sm text-gray-600 flex justify-between items-center mb-1">
                  <span
                    className={`font-semibold ${
                      item.userId === post.posterId
                        ? "text-green-600"
                        : "text-gray-800"
                    }`}
                  >
                    {nickname}
                  </span>
                  <span className="text-xs text-gray-400">{time}</span>
                </div>
                <div className="text-base mb-1">
                  {canView ? (
                    item.msg
                  ) : (
                    <span className="italic text-gray-400">
                      This is a private reply.
                    </span>
                  )}
                </div>
                {canView && (
                  <button
                    className="text-xs text-green-800 hover:font-bold cursor-pointer"
                    onClick={() => {
                      setReplyToUserId(item.userId);
                      setReplyMsg(`@${nickname} `);
                    }}
                  >
                    Reply
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
      {/*post modal*/}
      <BookPostModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialData={post}
        onSubmit={handleUpdate}
      />
    </>
  );
}
