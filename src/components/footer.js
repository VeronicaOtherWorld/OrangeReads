import { Search, BookOpen, User, Bell } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white px-6 py-6 text-sm">
      <div className="flex justify-between">
        <div>logo</div>
        <div className="space-x-4">
          <Link href="/">contact</Link>
          <Link href="/">contact</Link>
          <Link href="/">contact</Link>
          <Link href="/">contact</Link>
        </div>
      </div>
      <div className="mt-4">@ 2025 OrangeReads</div>
    </footer>
  );
}
