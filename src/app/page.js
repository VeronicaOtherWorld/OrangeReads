"use client";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Genre from "@/components/genre";
import BookCard from "@/components/bookCard";
import AIBot from "@/components/aiBot";
import dynamic from "next/dynamic";
import { books, authors } from "@/data/sampleData";
import BookCardSkeleton from "@/components/bookCardSkeleton";
import { TrendingUp, BookOpen, Users, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// const ReadingMap = dynamic(() => import("@/components/readingMap"), {
//   ssr: false,
// });

const bookSections = ["Bestsellers", "New Arrivals", "For you"];
export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // get home page books
  useEffect(() => {
    fetch("/api/homeBooks")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books);
        setIsLoading(false);
      });
  }, []);
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* nav bar*/}
      <Header />
      {/* genre*/}
      <Genre />
      {/* hero section*/}
      <div>
        <div className="flex justify-center items-center">
          explore reading map
        </div>
      </div>
      {/* book sections*/}
      {bookSections.map((section, sectionIndex) => (
        <div key={section} className="px-6 py-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{section}</h2>
            <Link href="/filterByCountry" className="text-orange-400 text-sm">
              find more
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 justify-center">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <BookCardSkeleton key={i} />
                ))
              : books
                  .slice(sectionIndex * 5, sectionIndex * 5 + 5)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="w-[220px] h-[360px] flex-shrink-0 flex-grow-0 cursor-pointer"
                      onClick={() => {
                        const query = new URLSearchParams({
                          title: item.title,
                          author: item.author,
                          cover: encodeURIComponent(item.cover),
                          nationality: item.nationality,
                          price: item.price.toString(),
                          description: item.description,
                        }).toString();
                        router.push(`/book/${item.id}?${query}`);
                      }}
                    >
                      <BookCard book={item} />
                    </div>
                  ))}
          </div>
        </div>
      ))}
      {/* foot */}
      <Footer />
    </div>
  );
}
