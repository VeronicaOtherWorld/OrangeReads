import { Star, Users, Calendar } from "lucide-react";

export default function BookCard({ book }) {
  return (
    <div className="flex flex-col items-center bg-white border-y-amber-200 p-4 shadow-sm hover:shadow-md transition w-full h-full">
      {/* cover */}
      <div className="w-full h-[280px] bg-white rounded-md overflow-hidden mb-3">
        <img
          className="w-full h-full object-cover"
          src={book.cover}
          alt={book.title}
        />
      </div>

      {/* title */}
      <div className="text-sm font-semibold text-center truncate h-[2.2rem] overflow-hidden text-ellipsis w-full px-1 leading-snug">
        {book.title}
      </div>
      {/* author */}
      <div className="text-sm text-center"> Author: {book.author}</div>
      {/* nationality */}
      <div className="text-sm text-gray-700 text-center mb-4">
        Nationality: {book.nationality}
      </div>
      {/* button */}
      <button className="mt-auto w-full bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-100 transition cursor-pointer">
        {" "}
        details
      </button>
    </div>
  );
}
