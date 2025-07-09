export default function PostCard({ post }) {
  return (
    <div className="border rounded-lg shadow-orange-50 overflow-hidden bg-white hover:shadow-md transition">
      <div className="bg-gray-500 h-48 flex items-center justify-center">
        <span className="text-gray-50">img</span>
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-lg mb-2">{post.title}</h2>
        <div className="text-sm mb-4">{post.description}</div>
        <button className="text-sm px-4 py-1 rounded">see more</button>
      </div>
    </div>
  );
}
