import { Search, BookOpen, User, Bell } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center px-6 py-4 shadow-amber-50">
      <div>logo</div>
      <nav className="flex space-x-4">
        <Link href="/" className="hover:text-orange-200">
          Home
        </Link>
        <Link href="/readingmap" className="hover:text-orange-200">
          Reading map
        </Link>
        <Link href="/bookExchange" className="hover:text-orange-200">
          Book Exchange
        </Link>
        <Link href="/shoppingCart" className="hover:text-orange-200">
          Cart
        </Link>
      </nav>
      <button className="px-4 py-1 bg-amber-400">
        <Link href="/login">login</Link>
      </button>
    </header>
  );
}
