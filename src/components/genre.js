import { Search, BookOpen, User, Bell } from "lucide-react";
import Link from "next/link";
const genre = ["Country", "Ireland", "USA", "UK", "Japan", "Germany"];
export default function GenreNav() {
  return (
    <div className="flex justify-center space-x-6 py-3 bg-amber-100 text-xs">
      {genre.map((item) => (
        <button key={item} className="hover:text-orange-200">
          {item}
        </button>
      ))}
    </div>
  );
}
