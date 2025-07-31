"use client";
import { useEffect, useState } from "react";
import BookCard from "./bookCard";

// get use author name to get qid in wikidata
const getQId = async (authorName) => {
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(
    authorName
  )}&language=en&format=json&origin=*`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.search && data.search.length > 0) {
      return data.search[0].id;
    }
  } catch (err) {
    console.log(err);
  }
};
// depends qid get nationality
const getNationality = async (qid) => {
  const query = `SELECT ?countryLabel WHERE {
      wd:${qid} wdt:P27 ?country.
      SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
    }
    LIMIT 1`;
  const url =
    "https://query.wikidata.org/sparql?query=" +
    encodeURIComponent(query) +
    "&format=json";
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.results.bindings.length > 0) {
      return data.results.bindings[0].countryLabel.value;
    }
  } catch (err) {
    console.log(err);
  }
  return "unknown";
};

// get nationality from openlibrary
// const getNationalityFromOpenLib = async (authorName) => {
//   try {
//     const url = `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(
//       authorName
//     )}`;
//     const res = await fetch(url);
//     const data = await res.json();

//     const authorKey = data.docs[0].key;
//     if (!authorKey) return null;
//     const detailUrl = `https://openlibrary.org${authorKey}.json`;
//     const detailRes = await fetch(detailUrl);
//     const detailData = await detailRes.json();
//     return detailData.bio;
//   } catch (err) {
//     console.log(err);
//   }
// };

export default function GoogleBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await fetch(
        "https://www.googleapis.com/books/v1/volumes?q=classic+literature&orderBy=relevance&maxResults=20&printType=books"
      );
      const data = await res.json();
      const completedBooks = [];
      if (data.items) {
        for (const item of data.items) {
          const info = item.volumeInfo;
          const authorName = info.authors?.[0] || "Unknown";
          let nationality = "";
          if (authorName) {
            const qid = await getQId(authorName);
            if (qid) {
              nationality = await getNationality(qid);
            }
            // if (!qid || qid === "Unknown") {
            //   const res = await getNationalityFromOpenLib(authorName);
            //   if (res) nationality = res;
            // }
          }
          if (nationality && nationality !== "unknown") {
            completedBooks.push({
              id: item.id,
              title: info.title,
              author: authorName,
              genre: info.categories,
              coverUrl: info.imageLinks?.thumbnail || "",
              nationality,
              rating: info.averageRating,
              description: info.description,
              publishedYear: info.publishedDate,
            });
          }
        }

        setBooks(completedBooks);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div>
      {books.map((item) => {
        return <BookCard key={item.id} book={item}></BookCard>;
      })}
    </div>
  );
}
