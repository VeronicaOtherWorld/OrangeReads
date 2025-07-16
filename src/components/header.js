"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import myAxios from "@/lib/myAxios";
import useUser from "@/hooks/useUser";

export default function Header() {
  // user
  const { user, checking } = useUser();

  // modify the email, not show the whole email address
  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    if (name.length <= 3) return "***@" + domain;
    return name.slice(0, 3) + "****@" + domain;
  };

  const handleLogout = async () => {
    // log out
    await myAxios.post("/auth/logout");
    // refresh page
    location.reload();
  };
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
      {/*login or show user info */}
      {checking ? (
        <div className="text-sm text-gray-500">Checking...</div>
      ) : user ? (
        <div className="flex flex-col items-end text-sm">
          <span className="text-gray-700">{maskEmail(user.email)}</span>
          <button
            onClick={handleLogout}
            className="mt-1 bg-amber-400 px-3 py-1 rounded hover:bg-yellow-500 text-sm"
          >
            logout
          </button>
        </div>
      ) : (
        <Link href="/login" className="px-4 py-1 bg-amber-200 rounded">
          login
        </Link>
      )}
    </header>
  );
}
