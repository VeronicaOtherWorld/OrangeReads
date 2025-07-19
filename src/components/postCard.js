import Link from "next/link";

export default function PostCard({ post }) {
  return (
    <Link href={`/posts/${post.id}`}>
      <div className="w-full rounded-lg border border-gray-100 overflow-hidden bg-white shadow-sm hover:shadow-[0_4px_14px_rgba(251,191,36,0.5)] transition">
        {post.img ? (
          <div className="w-full aspect-[4/3] overflow-hidden flex items-center justify-center bg-gray-100">
            <img
              src={post.img}
              alt="post image"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="text-gray-400 text-sm p-4 text-center">No Image</div>
        )}

        <div className="p-4">
          <h2 className="text-center text-base font-semibold mb-2">
            {post.title}
          </h2>
          <p className="text-sm text-gray-700 line-clamp-3 text-center mb-4">
            {post.postContent}
          </p>
          <div className="text-center">
            <span className="text-sm text-green-600 hover:text-amber-700 hover:font-semibold">
              see more
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
