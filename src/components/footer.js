import { Search, BookOpen, User, Bell } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0d1225] text-white py-10 min-h-[300px]">
      <div className="max-w-4xl mx-auto flex flex-row justify-center items-start gap-16 pt-20">
        {/* left side */}
        <div className="flex flex-col items-center space-y-2">
          <Link href="/">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-10 h-10 object-contain cursor-pointer"
            />
          </Link>
          <span className="text-sm">📚 Your book companion</span>
          <span className="text-sm">© 2025 OrangeReads</span>
        </div>

        {/* right side */}
        <div className="flex flex-col items-start space-y-2 text-sm ">
          <Link href="/" className="hover:text-green-400">
            home page
          </Link>
          <Link href="/filterByCountry" className="hover:text-green-400">
            all books
          </Link>
          <Link href="/readingmap" className="hover:text-green-400">
            reading map
          </Link>
          <Link href="/bookExchange" className="hover:text-green-400">
            book exchange
          </Link>
        </div>
      </div>
    </footer>
  );
}
