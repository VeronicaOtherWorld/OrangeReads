import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <>
      <Link href={`/posts/${post.id}`}>
        <div className="border rounded-lg shadow-orange-50 overflow-hidden bg-white hover:shadow-md transition">
          {post.img ? (
            <div className="w-full aspect-[4/3] overflow-hidden flex items-center justify-center bg-gray-100">
              <img
                src={post.img}
                alt="post image"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <span className="text-gray-400">No Image</span>
          )}

          <div className="p-4">
            <h2 className="font-semibold text-lg mb-2">{post.title}</h2>
            <div className="text-sm mb-4">{post.postContent}</div>
            <button className="text-sm px-4 py-1 rounded">see more</button>
          </div>
        </div>
      </Link>
    </>
  );
}
