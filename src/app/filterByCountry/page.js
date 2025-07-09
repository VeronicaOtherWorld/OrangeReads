"use client";
import { useState, useEffect } from "react";
import BookCard from "@/components/bookCard";
import Header from "@/components/header";
import Footer from "@/components/footer";
import BookCardSkeleton from "@/components/bookCardSkeleton";

import Link from "next/link";
import { useRouter } from "next/navigation";

const countries = [
  "All",
  "Ireland",
  "United States",
  "United Kingdom",
  "Japan",
  "Germany",
];

export default function FilterByCountry() {
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [books, setBooks] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    fetch("api/books")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books);
        setIsLoading(false);
      });
  }, []);

  const filteredBooks =
    selectedCountry === "All"
      ? books
      : books.filter((item) => item.nationality === selectedCountry);

  return (
    <div>
      <Header></Header>
      {/* nationality nav bar */}
      <div className="p-4">
        <div className="flex justify-center space-x-6 py-3 bg-amber-100 text-xs">
          {countries.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedCountry(item)}
              className={`hover:text-orange-500 transition font-medium ${
                selectedCountry === item
                  ? "text-orange-500 underline"
                  : "text-black"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* books */}
        <div className="flex flex-wrap gap-6 justify-center">
          {isLoading ? (
            <div className="flex flex-wrap gap-6 justify-center mt-4">
              {Array.from({ length: 10 }).map((_, idx) => (
                <BookCardSkeleton key={idx} />
              ))}
            </div>
          ) : filteredBooks.length > 0 ? (
            filteredBooks.map((item) => (
              <div
                className="w-[220px] h-[360px] flex-shrink-0 flex-grow-0 cursor-pointer animate-fade-in"
                key={item.id}
                onClick={() => {
                  const query = new URLSearchParams({
                    title: item.title,
                    author: item.author,
                    cover: item.cover,
                    nationality: item.nationality,
                    price: item.price.toString(),
                    description: item.description,
                  }).toString();
                  router.push(`book/${item.id}?${query}`);
                }}
              >
                <BookCard book={item} />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm mt-10 h-screen">
              No books found.
            </p>
          )}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}
