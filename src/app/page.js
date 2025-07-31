"use client";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import BookCard from "@/components/bookCard";
import BookCardSkeleton from "@/components/bookCardSkeleton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import myAxios from "@/lib/myAxios";
import useUser from "@/hooks/useUser";

const bookSections = ["Bestsellers", "New Arrivals", "For you"];
export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useUser();
  // get home page books
  useEffect(() => {
    (async () => {
      try {
        const res = await myAxios.get("/homeBooks", {
          withCredentials: false,
          validateStatus: () => true,
        });
        setBooks(res.data.books);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* nav bar*/}
      <Header />
      {/* hero section*/}
      {/* promote reading map section */}
      <div
        className="relative mx-auto my-10 max-w-6xl h-[450px] rounded-xl overflow-hidden shadow-md"
        style={{
          backgroundImage: `url('/map.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* cover */}
        <div className="absolute inset-0 bg-white/70 z-10" />

        {/* content */}
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-4">
            Explore your reading map!
          </h2>

          {!user ? (
            <>
              <p className="text-gray-700 text-base sm:text-lg mb-4">
                Login to unlock your reading map and see where your books come
                from.
              </p>
              <Link href="/login">
                <button className="cursor-pointer bg-white border border-amber-400 text-amber-500 hover:bg-amber-100 px-6 py-2 rounded-lg font-medium transition">
                  Login to explore
                </button>
              </Link>
            </>
          ) : (
            <>
              <p className="text-gray-700 text-base sm:text-lg mb-4">
                You have started your book journey, see your reading path on the
                map!
              </p>
              <Link href="/readingmap">
                <button className="bg-amber-400 text-white hover:bg-amber-500 px-6 py-2 rounded-lg font-medium transition">
                  Go to Reading Map
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
      {/* book sections*/}
      {bookSections.map((section, sectionIndex) => (
        <div key={section} className="px-6 py-8">
          <div className="flex justify-between items-center mb-4 px-2 sm:px-0 max-w-[1100px] mx-auto">
            <h2 className="text-xl font-bold">{section}</h2>
            <Link
              href="/filterByCountry"
              className="text-orange-400 text-sm font-semibold hover:font-bold hover:text-amber-700"
            >
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
